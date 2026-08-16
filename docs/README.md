# Documentación de Codenix

Esta carpeta concentra la referencia técnica del proyecto. Los documentos describen el sistema tal como está diseñado e identifican de forma explícita las configuraciones que deben completarse en cada entorno.

## Guía de lectura

| Documento | Propósito |
| --- | --- |
| [Arquitectura](architecture.md) | Componentes, responsabilidades y flujos principales. |
| [Despliegue](deployment.md) | Topología cloud, variables y operación por entorno. |
| [Juez en línea](judge.md) | Cola, worker, aislamiento y ciclo de evaluación. |
| [API](api.md) | Convenciones y recursos HTTP de integración. |
| [Datos](data-model.md) | Entidades de dominio, integridad y migraciones. |
| [Seguridad](security.md) | Controles implementados y tareas operativas. |
| [Desarrollo](development.md) | Requisitos, arranque local, pruebas y contribución. |
| [ADRs](decisions/README.md) | Registro breve de decisiones arquitectónicas. |
| [Especificaciones](specifications/README.md) | Requisitos de frontend y diseño evolutivo del juez. |

## Convenciones

- Los documentos distinguen entre comportamiento implementado y configuración requerida para producción.
- Una decisión transversal se registra como ADR; no se duplica en guías de componente.
- Los secretos, dominios reales y valores de producción no se documentan en texto plano.
