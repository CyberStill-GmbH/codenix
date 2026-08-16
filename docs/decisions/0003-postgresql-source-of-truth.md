# ADR-0003: PostgreSQL como fuente de verdad

**Estado:** Aceptada  
**Fecha:** 2026-08-15

## Contexto

Los resultados de ejecución necesitan un historial transaccional y consistente para perfiles, progreso y administración. Una cola no ofrece esas garantías como almacenamiento de negocio.

## Decisión

PostgreSQL conserva el estado de usuarios, problemas, ejecuciones, envíos y resultados por caso. Redis se utiliza únicamente para coordinación temporal de trabajos.

## Consecuencias

- El worker persiste el resultado final en una transacción.
- La eliminación de trabajos de Redis no elimina el historial de producto.
- Las migraciones Prisma son obligatorias para evolucionar el modelo.
