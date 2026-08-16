# J-007: Comparación y veredictos

**Estado:** Propuesto

La comparación determina si la salida observada cumple con la salida esperada; el veredicto combina esa información con fallos de compilación, ejecución y límites.

## Prioridad de resultados

Los fallos técnicos del programa prevalecen sobre la comparación: compilación, tiempo, memoria, límite de salida y error de ejecución se resuelven antes de evaluar respuesta correcta o incorrecta. Un fallo de plataforma se clasifica como `internal_error`.

Los comparadores se registran por política de problema. La comparación normalizada es el valor por defecto; tolerancia numérica o checker personalizado se incorporan solo con una especificación y pruebas propias.
