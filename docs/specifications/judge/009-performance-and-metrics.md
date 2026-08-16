# J-009: Rendimiento y métricas

**Estado:** Propuesto

## Objetivos

- Informar tiempo de ejecución y memoria máxima reales por caso y por ejecución.
- Reducir operaciones redundantes de Docker y filesystem sin cambiar contratos HTTP ni de cola.
- Preparar interfaces para caché de compilación o pool de contenedores, sin habilitarlos prematuramente.

## Requisitos

- `memoryKb` representa el máximo RSS del proceso de usuario, no el límite del contenedor.
- El sandbox, no el runner, recolecta métricas técnicas.
- La salida tiene un límite explícito y causa un veredicto distinguible.
- Las optimizaciones se miden antes y después con una carga representativa.

No forman parte de este RFC: pool de contenedores, judge interactivo, Firecracker, Kubernetes o workers distribuidos.
