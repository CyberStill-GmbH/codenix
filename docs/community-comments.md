# Comentarios, votos y perfiles públicos

La discusión se almacena en `comments`, con `parent_id` para respuestas y `deleted_at`
para borrado lógico. `comment_votes` tiene una restricción única por comentario y usuario,
por lo que un voto puede alternarse o cambiarse de dirección sin duplicados.

La reputación se mantiene en `user_reputation` y se calcula como `max(0, upvotes -
downvotes)` sobre los votos recibidos en los comentarios del usuario. La tabla evita
recalcular el valor al cargar el perfil. Los endpoints públicos están bajo
`/api/community`:

- `GET /problems/:problemId/comments?sort=best|newest|oldest&limit=20`
- `POST /problems/:problemId/comments`
- `POST /comments/:commentId/vote`
- `GET /users/:userId/profile`

Redis se usa como optimización y no como fuente de verdad: perfiles se cachean durante
30 segundos, los listados se invalidan tras crear un comentario y `SET NX` con TTL de
15 minutos deduplica vistas por visitante y perfil. Si Redis no está disponible, las
operaciones continúan contra PostgreSQL.
