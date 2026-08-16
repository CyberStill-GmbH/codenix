# J-008: Persistencia e idempotencia

**Estado:** Propuesto

La API crea el registro pendiente antes de encolar el trabajo. Al terminar, el worker persiste el estado final, métricas, salida de compilación y resultados por caso en una transacción.

La operación de finalización debe ser idempotente: un reintento no crea resultados duplicados ni sustituye un resultado final válido con uno obsoleto. La cola es transporte temporal; PostgreSQL conserva el historial funcional.

Se deben registrar identificadores de solicitud y trabajo para correlacionar API, cola y worker sin escribir código fuente ni secretos en logs.
