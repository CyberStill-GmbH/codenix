# ADR-0001: Juez asíncrono y aislado

**Estado:** Aceptada  
**Fecha:** 2026-08-15

## Contexto

Ejecutar código aportado por usuarios en el proceso HTTP expone la API a bloqueos, consumo impredecible y una superficie de seguridad innecesaria.

## Decisión

La API registra la solicitud y publica un trabajo BullMQ en Redis. Un worker independiente procesa el trabajo en contenedores efímeros con red deshabilitada y límites de recursos.

## Consecuencias

- La evaluación es eventual y requiere estados consultables por el cliente.
- API y worker se escalan y se despliegan por separado.
- Redis pasa a ser una dependencia operativa crítica para el flujo de evaluación.
- El fallo del worker queda aislado del tráfico de producto y puede observarse mediante trabajos pendientes o fallidos.
