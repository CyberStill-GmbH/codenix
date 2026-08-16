# Desarrollo y contribución

## Requisitos

- Node.js y npm compatibles con los paquetes de cada aplicación.
- Docker Desktop o Docker Engine para PostgreSQL, Redis y los runtimes del juez.
- Acceso a una base de datos de desarrollo; nunca reutilice credenciales de producción.

## Entorno local

El backend incluye una composición local de PostgreSQL y Redis. Desde `backend/`:

```bash
docker compose up -d
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

En otra terminal, inicie el worker con `npm run dev:worker`. Configure el frontend con su archivo de ejemplo y ejecútelo desde `frontend/` conforme a sus scripts de paquete.

Revise y complete los valores de `.env.example` antes de iniciar los servicios. Los archivos `.env` locales no se deben confirmar.

## Calidad

Antes de abrir un cambio:

```bash
# backend/
npm run typecheck
npm test
```

Agregue pruebas de integración cuando cambie contratos HTTP, validaciones, estados de evaluación o permisos. Las correcciones de seguridad y cambios de infraestructura requieren actualizar el documento correspondiente y, si afectan una decisión transversal, un ADR.

## Flujo de contribución

1. Cree una rama con un objetivo acotado.
2. Mantenga cambios de producto, infraestructura y documentación coherentes.
3. Verifique el comportamiento afectado y describa riesgos o migraciones en el pull request.
4. No incluya secretos, archivos generados innecesarios, logs ni artefactos de compilación.
