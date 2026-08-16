# Seguridad

## Controles de aplicación

La API aplica cabeceras de seguridad, validación de entradas, manejo centralizado de errores, identificación de solicitudes y límites de tasa para las operaciones de ejecución. La autenticación usa tokens Bearer; por ello CORS no habilita credenciales de cookies.

Las claves JWT se validan al iniciar y deben tener una longitud segura. Las credenciales OAuth, URLs de base de datos y tokens de Redis se inyectan como secretos por entorno.

## Datos y red

- PostgreSQL y Redis permanecen fuera de Internet público.
- La API usa las conexiones internas de Railway para los servicios allí alojados.
- La conectividad entre EC2 y Railway se cifra y restringe al mínimo necesario.
- Se realizan copias de seguridad verificables de PostgreSQL y se prueban restauraciones periódicamente.

## Ejecución no confiable

El aislamiento del juez se describe en [judge.md](judge.md). Docker reduce el riesgo, pero no elimina la necesidad de:

- Aplicar actualizaciones de seguridad al sistema operativo, Docker e imágenes de runtime.
- Usar una instancia y cuenta de servicio dedicadas, sin secretos ajenos al worker.
- Limitar permisos IAM al mínimo y restringir el acceso administrativo.
- Monitorizar consumo de recursos, contenedores huérfanos y tasas anómalas de ejecución.

## Lista previa a producción

- [ ] Secretos distintos por entorno, rotados y fuera de Git.
- [ ] TLS en todos los endpoints y conexiones externas entre servicios.
- [ ] URLs permitidas de CORS configuradas con el dominio de producción.
- [ ] Proxy público de PostgreSQL deshabilitado.
- [ ] Redis protegido por red, TLS y autenticación.
- [ ] Alertas para API, cola, worker y base de datos.
- [ ] Procedimiento probado de copia y restauración.
