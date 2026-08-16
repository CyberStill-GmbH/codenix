# Contrato de API

La API se publica bajo el prefijo `/api`. Es un contrato HTTP versionado por compatibilidad: cambios incompatibles requieren una estrategia de transición antes de llegar al frontend.

## Convenciones

- Las rutas protegidas usan `Authorization: Bearer <token>`.
- Las solicitudes y parámetros se validan en el límite de la API.
- Los errores siguen una respuesta JSON con código y mensaje; el frontend no debe depender de mensajes de texto para su lógica.
- Las operaciones de ejecución responden de forma asíncrona. El cliente debe consultar el recurso creado hasta que deje de estar pendiente.

## Recursos principales

| Área | Rutas destacadas |
| --- | --- |
| Salud | `GET /api/health` |
| Autenticación | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`, cierre de sesión, OAuth y recuperación de contraseña. |
| Problemas | `GET /api/problems`, `/search`, `/topics`, `GET /api/problems/:slug`. |
| Ejecución | `POST /api/problems/:problemId/run`, `GET /api/runs/:runId`. |
| Envíos | `POST /api/problems/:problemId/submissions`, `GET /api/submissions`, `GET /api/submissions/:submissionId`. |
| Progreso | `GET /api/users/me/stats`, `/progress` y `/activity`. |
| Administración | Gestión de problemas, publicación y casos de prueba bajo `/api/admin/problems`. |

## Integración de evaluación

Un `run` o `submission` crea un recurso inicialmente pendiente. Las interfaces deben mostrar ese estado, sondear el recurso correspondiente con una cadencia acotada y terminar el sondeo al recibir un resultado final. No deben reintentar automáticamente una solicitud de creación, pues podría duplicar ejecuciones.

La API aplica límites de tasa diferenciados para ejecuciones y envíos. Los clientes deben tratar `429` como una señal para esperar y comunicar la restricción a la persona usuaria.

Los detalles de estados y aislamiento están en [judge.md](judge.md).
