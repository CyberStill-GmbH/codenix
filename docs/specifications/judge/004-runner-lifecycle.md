# J-004: Ciclo de vida de runners

**Estado:** Propuesto

Un runner traduce una solución de un lenguaje a operaciones de compilación y ejecución. No conoce BullMQ, HTTP, Prisma ni la implementación de Docker.

## Contrato

1. Preparar archivos y comando de compilación cuando corresponda.
2. Entregar al sandbox una orden de compilación o ejecución.
3. Convertir resultados técnicos a un formato común sin decidir el veredicto.
4. Liberar recursos que sean propios del runner.

El registro de runners es la única fuente para asociar un lenguaje soportado con su implementación. Agregar un lenguaje exige plantilla, validación, runner, imagen de runtime y pruebas de contrato.
