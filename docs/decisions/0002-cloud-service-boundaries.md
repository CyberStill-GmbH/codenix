# ADR-0002: Límites de servicios cloud

**Estado:** Aceptada  
**Fecha:** 2026-08-15

## Contexto

El frontend, la API y el juez tienen perfiles de escalado y riesgo distintos. El worker necesita Docker y no debe ser accesible públicamente.

## Decisión

- Vercel entrega el frontend.
- Railway hospeda API, PostgreSQL y Redis.
- Una instancia EC2 dedicada ejecuta el worker de juez.

## Consecuencias

- La API y los datos aprovechan la red privada de Railway.
- La conexión de EC2 a Railway requiere una configuración explícita de red, autenticación y cifrado.
- El worker puede mantener imágenes Docker y controles de host sin trasladar esa carga al plano web.
- La observabilidad debe correlacionar solicitudes de API, trabajos Redis y logs del worker entre plataformas.
