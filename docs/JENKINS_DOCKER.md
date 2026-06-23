# Jenkins con Docker

Este proyecto incluye una instalacion local de Jenkins sobre Docker para ejecutar el pipeline definido en `Jenkinsfile`.

## Requisitos

- Docker Desktop o Docker Engine
- Docker Compose v2
- Acceso al socket Docker local

## Levantar Jenkins

Desde la raiz del repositorio:

```bash
docker compose -f docker-compose.jenkins.yml up -d --build
```

Jenkins quedara disponible en:

```text
http://localhost:8080
```

Para obtener la clave inicial:

```bash
docker exec codenix-jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

## Configurar el job

1. Entra a Jenkins en `http://localhost:8080`.
2. Instala los plugins recomendados si el asistente inicial lo solicita.
3. Crea un job de tipo Pipeline.
4. Configura el SCM apuntando a este repositorio.
5. Usa `Jenkinsfile` como script path.

## Que valida el pipeline

- Instala dependencias del frontend con `npm ci`.
- Ejecuta `npm run lint` y `npm run build` en frontend.
- Instala dependencias del backend con `npm ci`.
- Genera Prisma con `npm run db:generate`.
- Compila backend con `npm run build`.
- Levanta Postgres y Redis efimeros para CI.
- Ejecuta `npm test` en backend.

## Apagar Jenkins

```bash
docker compose -f docker-compose.jenkins.yml down
```

Para borrar tambien el volumen de Jenkins:

```bash
docker compose -f docker-compose.jenkins.yml down -v
```

## Nota de seguridad

El contenedor monta `/var/run/docker.sock` para que Jenkins pueda crear contenedores de CI. Esto es practico para desarrollo local, pero equivale a darle permisos altos sobre Docker al proceso de Jenkins.

