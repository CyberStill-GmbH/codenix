# Documentación de Codenix

La documentación se organiza por propósito y distingue entre el comportamiento disponible hoy, las decisiones aceptadas y las propuestas futuras.

## Estado actual

Codenix es una plataforma web de práctica algorítmica con catálogo de problemas, editor integrado, ejecuciones de prueba, envíos evaluados, progreso personal y discusión por problema. La API y el juez están separados: la API coordina trabajos y un worker aislado ejecuta código no confiable.

Para una vista consolidada de requisitos, componentes, flujos y operación, consulta el [diseño actual del sistema](system-design.md).

## Guía de lectura

### Producto y experiencia

| Documento | Contenido |
| --- | --- |
| [Frontend](frontend.md) | Aplicación web, rutas principales, editor y estados de interfaz. |
| [Comentarios y perfiles](community-comments.md) | Hilos, respuestas, votos, reputación y perfiles públicos. |
| [Hoja de ruta](roadmap.md) | Trabajo próximo y criterios para priorizarlo. |

### Ingeniería

| Documento | Contenido |
| --- | --- |
| [Arquitectura](architecture.md) | Límites entre frontend, API, persistencia, cola y worker. |
| [Diseño del sistema](system-design.md) | Requisitos, componentes, flujos, contratos y trade-offs. |
| [API](api.md) | Convenciones HTTP y recursos principales. |
| [Datos](data-model.md) | Entidades, integridad y migraciones Prisma. |
| [Juez en línea](judge.md) | Evaluación asíncrona, aislamiento y métricas. |
| [Seguridad](security.md) | Controles de aplicación, red y ejecución no confiable. |
| [Desarrollo](development.md) | Requisitos locales, comandos y controles de calidad. |
| [Despliegue](deployment.md) | Entornos, servicios y operación de producción. |

### Gobierno técnico

| Documento | Contenido |
| --- | --- |
| [Contribución](contributing.md) | Flujo de trabajo, revisión y criterios para pull requests. |
| [ADRs](decisions/README.md) | Decisiones arquitectónicas aceptadas y su contexto. |
| [Especificaciones](specifications/README.md) | Requisitos verificables de frontend y del juez. |

## Convenciones documentales

- **Implementado** describe comportamiento comprobable en el código actual.
- **Propuesto** describe una dirección aprobada que todavía requiere implementación o validación.
- **Histórico** conserva contexto y no prescribe trabajo nuevo.
- Los secretos, dominios privados y credenciales nunca se escriben en estos documentos.
- Una decisión que afecta a más de un componente debe tener un ADR; una especificación define comportamiento verificable.

Los documentos `ANTIGRAVITY_*`, `antigravity_*` y los prompts de rescate se conservan como material histórico de trabajo. No sustituyen a las guías normativas enlazadas aquí.
