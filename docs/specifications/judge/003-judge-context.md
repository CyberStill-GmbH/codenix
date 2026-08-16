# J-003: Contexto de ejecución

**Estado:** Propuesto

## Decisión

Cada trabajo crea una única instancia de `JudgeContext` que acompaña la ejecución completa. La solicitud es inmutable; las demás secciones tienen un propietario claro.

| Sección | Propietario |
| --- | --- |
| Solicitud, límites y casos | Creación del contexto; solo lectura después. |
| Runner, workspace y sandbox | Preparación. |
| Resultado de compilación | Compilación. |
| Resultados y métricas | Ejecución. |
| Comparación por caso | Comparación. |
| Veredicto final | Etapa de veredicto. |

El contexto elimina parámetros proliferantes y facilita pruebas de cada etapa. No se permite estado global mutable ni reemplazar la instancia durante el trabajo.
