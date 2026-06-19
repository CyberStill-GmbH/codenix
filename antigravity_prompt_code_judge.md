# PROMPT ANTIGRAVITY — Diseño e implementación del Juez de Código (Judge) para Codenix

> Rol: actúa como un Staff Engineer especializado en sistemas de ejecución segura de código (sandboxing, aislamiento, infraestructura de jueces tipo LeetCode/Codeforces/HackerRank). Este es un sistema crítico de seguridad: ejecuta código arbitrario y no confiable enviado por usuarios. Cada decisión debe priorizar el aislamiento y la contención por encima de la conveniencia de implementación.

---

## CONTEXTO DEL PROYECTO

Codenix ya tiene un backend funcionando con endpoints de `problems`, `submissions`, `users`, `auth` y `admin` (documentados en `BACKEND_DECISIONS.md` y `FRONTEND_INTEGRATION.md` del proyecto — léelos primero, están en el repo). El frontend ya tiene la UI de editor de código, Run/Submit, y paneles de resultado **esperando** que estos endpoints existan:

- `POST /api/problems/:problemId/run` — ejecuta el código contra testcases de muestra (sample), respuesta rápida.
- `POST /api/problems/:problemId/submissions` — ejecuta contra todos los testcases (incluidos hidden), genera un veredicto oficial.
- `GET /api/runs/:runId` — si la ejecución es asíncrona, polling de estado.

El shape de un problema ya definido incluye:
```json
{
  "supported_languages": ["python", "javascript", "typescript", "c", "rust"],
  "starter_code": { "python": "...", "javascript": "...", "...": "..." },
  "time_limit_ms": 2000,
  "memory_limit_mb": 256,
  "testcases": [
    { "id": "string", "input": {}, "expected_output": "any", "is_sample": true }
  ]
}
```

El judge que construyas debe respetar este contrato existente — no lo cambies sin justificación documentada, y si necesitas extenderlo, hazlo de forma aditiva y compatible.

---

## PASO 0 — Investigación profunda (obligatoria antes de diseñar nada)

No escribas código todavía. Investiga y documenta en `JUDGE_RESEARCH.md`:

1. **Tecnologías de aislamiento de procesos**, comparadas en una tabla con: nivel de aislamiento, overhead de arranque, madurez/uso en producción, complejidad operativa:
   - `isolate` (usado por Codeforces y CMS — sandboxing ligero vía namespaces + cgroups, diseñado específicamente para jueces de programación)
   - `gVisor` (runsc) — kernel en espacio de usuario, usado por Google Cloud Run
   - `Firecracker` (microVMs) — usado por AWS Lambda y plataformas de ejecución de código serverless
   - `nsjail` — sandboxing de Google basado en namespaces + seccomp-bpf
   - Contenedores Docker "planos" sin hardening adicional (documenta por qué esto NO es suficiente por sí solo)
2. **Investiga cómo resuelven esto judges reales y de código abierto**: Judge0, HackerEarth's sandbox, el sandbox de Codeforces/`ejudge`, el de LeetCode (lo que sea públicamente conocido de su arquitectura). Extrae patrones comunes.
3. **Investiga el modelo de colas/workers** apropiado dado que el backend actual usa [investiga el stack real del proyecto: Node.js/TypeScript según lo visto en el resto del repo]. Compara: cola en Redis (BullMQ si es Node), cola nativa de la base de datos (polling con `FOR UPDATE SKIP LOCKED`), o un broker dedicado (RabbitMQ). Justifica la elección según la escala esperada de un MVP/proyecto universitario, no sobre-ingenierices.
4. **Investiga límites de recursos por lenguaje**: cómo limitar correctamente CPU, memoria, tiempo de pared, número de procesos/threads, tamaño de output, y descriptores de archivo para cada uno de: Python (CPython), Node.js (JS/TS compilado con `tsc` o ejecutado con `ts-node`/`tsx`), C (compilado con `gcc`/`clang`), Rust (compilado con `rustc`/`cargo`).
5. Entrega `JUDGE_RESEARCH.md` con tus conclusiones y la tecnología recomendada antes de proceder al diseño. Si concluyes que una combinación es la correcta (ej. `isolate` o `nsjail` + cgroups v2 + seccomp, orquestado por workers en cola), justifícalo con base en la investigación, no por preferencia personal.

---

## PASO 1 — Arquitectura (documenta antes de implementar)

Diseña y documenta en `JUDGE_ARCHITECTURE.md` con diagramas (usa Mermaid: secuencia y componentes):

1. **Diagrama de componentes**: API Gateway/backend existente → Cola de jobs → Pool de Workers → Sandbox de ejecución por lenguaje → Almacenamiento de resultados → Notificación de vuelta al backend/frontend.
2. **Diagrama de secuencia** del flujo completo de un `Run` y de un `Submit`, incluyendo: encolado, dispatch a worker, compilación (si aplica), ejecución por testcase, comparación de output, recolección de métricas (tiempo, memoria), y entrega del veredicto.
3. **Modelo de datos** del job de ejecución: qué se encola (código fuente, lenguaje, problemId, testcases a correr, límites), y qué se persiste como resultado.
4. **Decide y documenta si la ejecución es síncrona (request-response directo, válido solo si el tiempo de respuesta es predecible y corto) o asíncrona (cola + polling vía `GET /api/runs/:runId`)** — dado que ya existe ese endpoint de polling documentado en el frontend, diseña para el modelo asíncrono como caso general, pero permite que `Run` (sample testcases, pocos y rápidos) pueda resolverse de forma síncrona si el research del Paso 0 lo justifica, mientras `Submit` (todos los testcases) siempre pase por cola.

---

## PASO 2 — Requisitos de seguridad (NO NEGOCIABLES)

Cada ejecución de código de usuario debe cumplir TODOS estos puntos. Si alguno no se puede garantizar con la tecnología elegida, vuelve al Paso 0 y reconsidera.

1. **Aislamiento de proceso**: cada ejecución corre en un namespace/contenedor/VM aislado, destruido inmediatamente después (nunca reutilizar el mismo sandbox entre ejecuciones de distintos usuarios o distintos submits).
2. **Usuario no privilegiado**: el código del usuario nunca corre como root ni con capacidades elevadas. Sin `setuid`, sin acceso a `/proc` del host, sin `CAP_SYS_ADMIN` ni capabilities innecesarias.
3. **Sin acceso a red**: el sandbox de ejecución tiene la interfaz de red deshabilitada por completo — ni siquiera loopback hacia el host. Ningún código de usuario puede hacer llamadas salientes.
4. **Filesystem de solo lectura** salvo un directorio scratch temporal con cuota de tamaño máxima (ej. 50MB), montado con `noexec` salvo el binario/intérprete necesario para correr el código compilado.
5. **Límites de recursos estrictos y forzados a nivel de kernel** (cgroups, no solo `ulimit` de shell):
   - CPU time: el `time_limit_ms` del problema, con un margen de gracia mínimo documentado.
   - Memoria: el `memory_limit_mb` del problema, hard kill si se excede (OOM kill controlado, no degradación).
   - Wall clock timeout: límite absoluto de tiempo real (más generoso que el CPU time, para detectar I/O bloqueante o sleeps maliciosos), nunca debe poder colgar un worker indefinidamente.
   - Número máximo de procesos/threads/forks — previene fork bombs.
   - Tamaño máximo de stdout/stderr capturado — previene ataques de espacio en disco/memoria por output masivo.
   - Número de archivos abiertos.
6. **Filtrado de syscalls (seccomp-bpf o equivalente del mecanismo elegido)**: bloquea syscalls peligrosas no necesarias para ejecutar código (`ptrace`, `mount`, `reboot`, `socket` si no se permite red, etc.) — usa allowlist, no denylist.
7. **Sin acceso a variables de entorno o secretos del host** — el sandbox recibe solo el entorno mínimo necesario para compilar/ejecutar el lenguaje correspondiente.
8. **Límite de tamaño de código fuente recibido** antes de siquiera intentar compilar/ejecutar (previene payloads gigantes).
9. **Sanitización de paths**: el nombre de archivo del código fuente y cualquier path generado debe ser controlado por el sistema, nunca derivado de input del usuario sin sanitizar.
10. **Logging y auditoría**: cada ejecución registra quién la disparó, qué problema, qué lenguaje, resultado, y métricas — sin loggear el código fuente completo en logs persistentes de bajo nivel si hay riesgo de exposición de soluciones entre usuarios (decide y documenta la política de retención).
11. **Rate limiting**: límite de ejecuciones por usuario por minuto a nivel de API, antes de que el job llegue siquiera a la cola — previene abuso del judge como recurso de cómputo gratuito.

---

## PASO 3 — Especificación por lenguaje

Para cada lenguaje, documenta y construye el runner correspondiente:

### Python
- Versión a fijar explícitamente (ej. 3.12), sin acceso a `pip install` en tiempo de ejecución.
- Sin imports de módulos peligrosos innecesarios para resolver problemas algorítmicos — evalúa si restringir imports vía AST estático antes de ejecutar (capa adicional, no sustituye el sandboxing a nivel de SO) o si confiar completamente en el aislamiento de proceso es suficiente; documenta la decisión.

### JavaScript / TypeScript
- Node.js con versión fijada. TypeScript se transpila (`tsc` o `esbuild`, el research del Paso 0 debe decidir cuál por velocidad) antes de ejecutar, nunca con `eval` directo del código del usuario en el proceso del worker.
- Sin acceso a `require('child_process')`, `require('fs')` de escritura fuera del scratch dir, ni `require('net')` — refuerza esto con el sandboxing de proceso, no confíes solo en convención de código.

### C
- Compilación con flags de hardening: `-Wall -Wextra`, sin desactivar protecciones del compilador, límite de tiempo de compilación separado del tiempo de ejecución.
- El binario compilado corre dentro del mismo sandbox aislado que los demás lenguajes — nunca con privilegios adicionales por ser código nativo.

### Rust
- Compilación con `rustc` o `cargo` fijando una toolchain version. Sin acceso a crates externos vía red (offline build, o un set de crates pre-vendidos si el problema lo requiere — decide y documenta).
- Límite de tiempo de compilación separado, ya que Rust puede tardar más en compilar que en ejecutar.

**Para todos los lenguajes**: separa explícitamente el tiempo de compilación del tiempo de ejecución en las métricas devueltas — un timeout de compilación no debe reportarse como Time Limit Exceeded de ejecución, sino como Compile Error con el mensaje de error real del compilador.

---

## PASO 4 — Contrato de comparación de resultados

1. Implementa la comparación de output del usuario contra `expected_output` de forma robusta: normaliza whitespace final de línea, decide explícitamente si el trailing newline importa (documenta la decisión), y soporta comparación estructurada cuando el output es JSON/array vs comparación de texto plano cuando es string simple — basado en el tipo definido en el schema de parámetros del problema (ya definido en el sistema de admin de problemas existente).
2. Define los veredictos posibles de forma exhaustiva y consistente con lo que el frontend ya espera (`Accepted`, `Wrong Answer`, `Time Limit Exceeded`, `Memory Limit Exceeded`, `Runtime Error`, `Compilation Error`) — usa exactamente estos nombres o los que ya estén establecidos en el contrato de API existente, no inventes nuevos sin documentarlo.

---

## PASO 5 — Integración con el backend existente

1. Implementa exactamente los tres endpoints ya esperados por el frontend (`POST .../run`, `POST .../submissions`, `GET /api/runs/:runId`) respetando el shape de request/response que el frontend ya tiene implementado (revisa el código del frontend del editor para confirmar el shape exacto esperado antes de finalizar el contrato).
2. No rompas ningún endpoint existente de `problems`/`submissions` ya documentado — esto es una extensión, no un reemplazo.
3. Al completarse una submission, persiste el resultado de forma que `GET /api/submissions/:submissionId` (ya existente) pueda devolver el detalle histórico completo, incluyendo `testcaseResults` como ya espera el frontend según `FRONTEND_INTEGRATION.md`.
4. Actualiza el cálculo de `solved` (ya implementado en el trabajo de backend anterior) para que se dispare correctamente cuando una nueva submission resulte en `Accepted`.

---

## PASO 6 — Código modular

Estructura esperada (ajusta a la convención del proyecto, pero mantén esta separación de responsabilidades):

```
judge/
  api/                    ← controladores HTTP de run/submissions/runs
  queue/                  ← definición de jobs, productor, consumidor
  workers/                ← lógica de dispatch a sandbox por lenguaje
  sandbox/
    runners/
      python.runner.ts
      javascript.runner.ts
      typescript.runner.ts
      c.runner.ts
      rust.runner.ts
    base.runner.ts         ← interfaz/clase común que todos implementan
    resource-limits.ts     ← configuración de cgroups/límites compartida
    security-policy.ts     ← seccomp/allowlist de syscalls
  comparators/             ← lógica de comparación de output (Paso 4)
  verdicts/                ← enum y lógica de determinación de veredicto
  metrics/                 ← captura de tiempo/memoria por ejecución
  tests/
```

1. Cada lenguaje implementa una interfaz común `LanguageRunner` (compile opcional, execute, parseando límites y devolviendo un resultado normalizado) — agregar un lenguaje nuevo en el futuro debe significar implementar un runner nuevo, no tocar el orquestador central.
2. Sin lógica de negocio de comparación de resultados dentro de los runners — los runners solo ejecutan y devuelven output crudo + métricas; la comparación vive en `comparators/`.
3. TypeScript estricto, sin `any`, tipos explícitos para el job de ejecución y su resultado.

---

## PASO 7 — Tests

1. Tests unitarios de cada `comparator` con casos de borde (trailing whitespace, arrays con distinto orden si aplica, números flotantes con tolerancia si el problema lo requiere).
2. Tests de integración por lenguaje: un "Hello World" que debe pasar, un timeout intencional que debe devolver TLE, un código que excede memoria que debe devolver MLE, un código con error de sintaxis que debe devolver Compile Error, un fork bomb o intento de acceso a red que debe ser contenido sin afectar al worker/host (test de seguridad explícito, no solo funcional).
3. Test de carga básico: N ejecuciones concurrentes no deben afectar el aislamiento entre ellas (un test cruzado: el resultado de la ejecución A no debe poder filtrarse a la ejecución B).

---

## PASO 8 — Documentación final con gráficos

Entrega (todos en Markdown con diagramas Mermaid donde aplique):

1. `JUDGE_RESEARCH.md` (Paso 0) — comparación de tecnologías y justificación de la elegida.
2. `JUDGE_ARCHITECTURE.md` (Paso 1) — diagrama de componentes, diagrama de secuencia de Run y de Submit, modelo de datos del job.
3. `JUDGE_SECURITY.md` — checklist de cada punto del Paso 2 con cómo fue implementado y verificado (referencia a los tests del Paso 7 que lo prueban).
4. `JUDGE_API.md` — contrato final de los tres endpoints, con ejemplos de request/response reales.
5. Actualización de `FRONTEND_INTEGRATION.md` existente: agrega la sección de Run/Submit/Runs que antes estaba marcada como `TODO: API-PENDING`, ahora con el contrato real para que el frontend la integre.

---

## ENTREGABLE FINAL

- Los 5 documentos del Paso 8
- Lista de archivos de código creados, organizados por la estructura del Paso 6
- Resultado de los tests (incluyendo los de seguridad) pasando
- Confirmación explícita de qué tecnología de aislamiento se usó en producción y por qué, citando el research del Paso 0
- Cualquier limitación conocida o trade-off aceptado documentado explícitamente (ej. "no se soporta instalación de paquetes externos en Python" o similar)
