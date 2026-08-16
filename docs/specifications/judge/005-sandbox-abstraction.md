# J-005: Abstracción de sandbox

**Estado:** Propuesto

Los runners dependen de una interfaz de sandbox, no de comandos Docker. La implementación Docker actual continúa siendo válida, pero queda detrás de la interfaz para permitir mejoras de seguridad u operación.

La interfaz debe recibir una orden, límites de CPU/memoria/tiempo y entradas; debe devolver salida, error, código de salida, tiempo, memoria máxima y señales de límite. Nunca decide si la salida es correcta.

Toda implementación debe preservar aislamiento de red, privilegios mínimos, filesystem restringido y limpieza garantizada. Un cambio a otra tecnología de aislamiento requiere ADR y evaluación de seguridad.
