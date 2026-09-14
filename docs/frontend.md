# Frontend

## Alcance

La aplicación web vive en `frontend/` y está construida con React, TypeScript y Vite. Consume la API mediante rutas HTTP, conserva la sesión en el navegador y presenta el flujo completo de práctica sin ejecutar código localmente.

## Rutas principales

| Área | Experiencia |
| --- | --- |
| `/` | Landing pública y acceso al producto. |
| `/login`, `/register` | Inicio de sesión y registro. |
| `/problems` | Biblioteca con búsqueda, filtros, temas y progreso. |
| `/problems/:slug` | Espacio de resolución: enunciado, editor, ejecución, envíos y discusión. |
| `/submissions` | Historial y detalle de envíos. |
| `/profile` y `/u/:username` | Perfil propio y perfil público. |
| `/admin/problems` | Gestión administrativa de problemas, casos y plantillas. |

## Principios de interfaz

- La landing mantiene su tema oscuro; el producto permite modo claro y oscuro según la preferencia de la persona usuaria.
- Los estados de carga, vacío, error y éxito tienen una representación explícita y accionable.
- La navegación y los controles conservan foco visible, contraste suficiente y soporte de teclado.
- Las acciones de ejecución y envío muestran progreso y evitan duplicados mientras hay un trabajo pendiente.
- El editor muestra la función esperada; los adaptadores, serialización y casos oficiales permanecen en el servidor.

## Integración con la API

La sesión se hidrata al abrir la aplicación y se revalida con `GET /api/auth/me`. Los recursos protegidos incluyen el token Bearer sin exponer secretos de backend. Las ejecuciones son asíncronas: el cliente crea el recurso una vez y consulta su estado hasta un resultado terminal.

Los errores se muestran como mensajes breves cerca de la acción que falló. Las respuestas de comentarios, votos, perfil y progreso actualizan el estado local sin invalidar innecesariamente toda la página.

## Desarrollo

Desde `frontend/`:

```bash
npm install
npm run dev
npm run typecheck
npm run lint
npm run build
```

La URL de la API y el origen público se configuran mediante las variables documentadas en el archivo de ejemplo del frontend. Nunca se deben incluir credenciales de PostgreSQL, Redis o JWT en el bundle.

Las especificaciones de la experiencia de resolución están en [specifications/frontend](specifications/frontend/README.md).
