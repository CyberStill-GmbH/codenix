# Especificaciones del juez

Estas RFCs separan el estado de producción del diseño objetivo. La implementación actual usa una cola BullMQ, runners por lenguaje y contenedores Docker; los documentos propuestos describen cómo evolucionar esa base sin romper contratos.

| ID | Especificación | Estado |
| --- | --- | --- |
| [J-001](001-vision-and-principles.md) | Visión y principios | Estable |
| [J-002](002-execution-pipeline.md) | Pipeline de ejecución | Propuesto |
| [J-003](003-judge-context.md) | Contexto de ejecución | Propuesto |
| [J-004](004-runner-lifecycle.md) | Ciclo de vida de runners | Propuesto |
| [J-005](005-sandbox-abstraction.md) | Abstracción de sandbox | Propuesto |
| [J-006](006-workspace-management.md) | Área de trabajo temporal | Propuesto |
| [J-007](007-verdict-and-comparison.md) | Comparación y veredictos | Propuesto |
| [J-008](008-persistence-and-idempotency.md) | Persistencia e idempotencia | Propuesto |
| [J-009](009-performance-and-metrics.md) | Rendimiento y métricas | Propuesto |
| [J-010](010-roadmap.md) | Hoja de ruta | Propuesto |

La operación y los controles actuales se documentan en [Juez en línea](../../judge.md).
