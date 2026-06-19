# Code Judge Architecture

## Bitácora de implementación

| Fecha | Acción | Decisiones Técnicas y Notas |
|-------|--------|-----------------------------|
| 2026-06-19 | Inicio de arquitectura | Se aprueba el uso de Docker hardened y BullMQ. |
| 2026-06-19 | Implementación Cola y Runners | Se añaden dependencias bullmq, ioredis. Se implementa BaseRunner y específicos (Python, JS, TS, C, Rust). Para TS se decidió usar transpilar en el host antes de Docker para no requerir imagen Docker de TS con red. |
| 2026-06-19 | Comparadores y Veredictos | Se reutilizó enum Prisma SubmissionResult. Lógica simple de trimEnd() y match. |
| 2026-06-19 | Refactor Controladores | MockJudgeService eliminado de controllers, todo encola en BullMQ asíncronamente y worker actualiza db. |
