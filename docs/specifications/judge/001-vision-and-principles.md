# J-001: Visión y principios del juez

**Estado:** Estable

## Propósito

El juez permite ejecutar soluciones de forma segura, repetible y extensible para prácticas y envíos evaluados. Está inspirado en las expectativas de plataformas de programación competitiva, sin acoplar la arquitectura a un lenguaje ni a una tecnología de sandbox concreta.

## Principios

- El worker es un adaptador de cola; no contiene reglas de evaluación.
- Compilar, ejecutar, comparar, decidir y persistir son responsabilidades distintas.
- Los runners describen el lenguaje; el sandbox describe el aislamiento.
- El código de usuario nunca obtiene red, secretos ni acceso directo a servicios de producto.
- Un error del programa no es un error de infraestructura.
- Cada ejecución debe terminar con limpieza de recursos y un estado persistido.

## Alcance actual

El sistema admite Python, JavaScript, TypeScript, C y Rust. La API crea ejecuciones o envíos, Redis transporta el trabajo y el worker persiste el resultado. Los detalles operativos están en [Juez en línea](../../judge.md).
