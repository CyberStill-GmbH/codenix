# Juez en línea

## Diseño

La API no ejecuta soluciones. Crea un registro de ejecución (`CodeRun`) o envío (`Submission`) con estado pendiente y publica un trabajo en la cola `judge-queue`. Un worker dedicado consume el trabajo, ejecuta los casos de prueba y actualiza el registro con el veredicto, métricas y resultados individuales.

El contrato actual contempla Python, JavaScript, TypeScript, C y Rust. La lista de lenguajes que aparece al usuario, las plantillas y los runners deben mantenerse alineadas; cualquier cambio requiere pruebas de integración.

## Estados y veredictos

Las ejecuciones pasan por `pending` y, en el caso de una ejecución de prueba, por `running`. El resultado final puede ser `accepted`, `wrong_answer`, `runtime_error`, `time_limit_exceeded`, `memory_limit_exceeded`, `compilation_error` o `internal_error`.

Un resultado de infraestructura se registra como `internal_error`; no debe presentarse como error de la solución de la persona usuaria.

## Aislamiento

Cada solución se ejecuta en un contenedor efímero. El runner aplica, como mínimo:

- Red deshabilitada.
- Sistema de archivos raíz de solo lectura y directorio temporal limitado.
- Usuario no privilegiado, capacidades Linux eliminadas y `no-new-privileges`.
- Límites de CPU, memoria, procesos, descriptores de archivo, tiempo y salida.
- Eliminación del contenedor al finalizar, incluso si la ejecución falla.

La instancia EC2 dedicada es parte del límite de seguridad: no debe alojar la API ni servicios con datos de negocio.

## Operación

- Mantener el worker como proceso supervisado y reiniciable.
- Alertar por trabajos en espera, fallidos o con tiempo de procesamiento anómalo.
- Registrar identificadores de trabajo y errores técnicos sin escribir código fuente ni secretos en los logs.
- Aplicar límites de tasa en los endpoints de ejecución para proteger la cola y la instancia.

La decisión de aislar este plano se formaliza en [ADR-0001](decisions/0001-async-isolated-judge.md).
