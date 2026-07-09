<p align="center">
  <img src="docs/docs-img/codenix.png" width="10%" alt="Cabecera del proyecto">
</p>

<div align="center">

# Codenix

**Plataforma web para practicar programación competitiva y algoritmos.**
Problemas, envíos de soluciones, ejecución de código y seguimiento de progreso — todo en un solo lugar.

Un proyecto de **IEEE Computer Society — Rama Estudiantil UNI**

[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)](https://expressjs.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io)
[![Redis](https://img.shields.io/badge/Redis-DC382D?logo=redis&logoColor=white)](https://redis.io)
[![BullMQ](https://img.shields.io/badge/BullMQ-FF3A3A?logo=redis&logoColor=white)](https://docs.bullmq.io)
[![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)](https://www.docker.com)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

[Roadmap](docs/roadmap.md) · [Arquitectura](docs/architecture.md) · [Frontend](docs/frontend.md) · [Juez en línea](docs/judge.md) · [API](docs/api.md) · [Contribuir](docs/contributing.md) · [Decisiones técnicas](docs/decisions)

</div>

---

## Sobre el proyecto

Codenix es una iniciativa de **IEEE Computer Society, Rama Estudiantil UNI**, pensada para acercar la programación competitiva y el desarrollo de algoritmos a la comunidad estudiantil de la Universidad Nacional de Ingeniería y a cualquier persona que quiera mejorar resolviendo problemas.

Nace con un objetivo claro: dar a los estudiantes un espacio propio, hecho por y para la comunidad IEEE-UNI, donde practicar no dependa de plataformas externas ni de configurar nada en local — solo entrar, elegir un problema y programar.

El proyecto prioriza una base sólida antes que features vistosas: arquitectura clara, backend preparado para ejecutar código de forma segura y asíncrona, y una interfaz moderna inspirada en las plataformas de coding que ya conoces.

### ¿Qué puedes hacer aquí?

- Explorar problemas de programación organizados por dificultad y tema.
- Escribir y enviar soluciones desde el navegador.
- Ejecutar código en los lenguajes soportados y ver el resultado del juicio (AC, WA, TLE, RE...).
- Revisar el historial y el detalle de tus envíos.
- Seguir tu progreso dentro de la plataforma.
- Practicar con una interfaz clara e inspirada en plataformas modernas de coding.

---

## Stack tecnológico

### Frontend

| Tecnología | Uso |
|---|---|
| **React** | Librería de UI |
| **TypeScript** | Tipado estático en todo el frontend |
| **Vite** | Bundler y entorno de desarrollo |
| **Tailwind CSS** | Estilos utilitarios |

### Backend / API

| Tecnología | Uso |
|---|---|
| **Node.js + Express** | Servidor HTTP y capa de rutas/controladores |
| **TypeScript** | Tipado estático en todo el backend |
| **Prisma + PostgreSQL** | ORM y base de datos relacional |
| **Zod** | Validación de esquemas en cada endpoint |
| **JWT (jsonwebtoken)** | Autenticación stateless (access tokens firmados HS256) |
| **OAuth 2.0 (Google, GitHub)** | Login social, con `state` firmado (HMAC) para protección CSRF |
| **bcryptjs** | Hash de contraseñas |
| **express-rate-limit** | Límites de tasa en endpoints sensibles (login, registro, reset de contraseña) |

### Juez en línea / procesamiento asíncrono

| Tecnología | Uso |
|---|---|
| **Redis** | Almacenamiento en memoria para colas y caché |
| **BullMQ** | Cola de trabajos para desacoplar el envío de una solución de su ejecución/juicio real |

Ejecutar código arbitrario de forma segura toma tiempo y no puede bloquear la petición HTTP del usuario. Por eso cada envío se encola con **BullMQ** (respaldado por **Redis**) y se procesa en un *worker* independiente, que compila/ejecuta la solución contra los casos de prueba y actualiza el resultado del envío de forma asíncrona.

Lenguajes objetivo para ejecución de soluciones en la primera versión:

- Python
- Java
- C

> Esta sección se actualizará conforme se consoliden las decisiones técnicas del juez. Ver [`docs/judge.md`](docs/judge.md).

### Infraestructura / DevOps

| Tecnología | Uso |
|---|---|
| **Docker + Docker Compose** | Servicios locales (Redis, Jenkins, etc.) |
| **Jenkins** | Pipeline de CI definido en `Jenkinsfile` |

---

## Instalación y puesta en marcha

### Requisitos

Antes de empezar, asegúrate de tener instalado:

- Node.js
- npm
- Git
- Docker y Docker Compose (para Redis, servicios locales y Jenkins)

### Clonar el repositorio

```bash
git clone https://github.com/<usuario>/<repositorio>.git
cd <repositorio>
```

### Frontend

```bash
npm install
npm run dev
```

Luego abre la URL local que indique la terminal, normalmente:

```
http://localhost:5173
```

### Backend / API

> Ajusta las rutas de los comandos si tu estructura de carpetas difiere (por ejemplo, `apps/api` en un monorepo).

```bash
cd api
npm install
```

Crea un archivo `.env` a partir de `.env.example` con, al menos, las siguientes variables:

```bash
# Servidor
NODE_ENV=development
PORT=3000

# Base de datos
DATABASE_URL=postgresql://user:password@localhost:5432/codenix

# JWT (access token)
JWT_ACCESS_SECRET=
JWT_ACCESS_EXPIRES_IN=15m
JWT_ACCESS_ISSUER=codenix
JWT_ACCESS_AUDIENCE=codenix-client

# OAuth — Google
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

# OAuth — GitHub
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_CALLBACK_URL=http://localhost:3000/auth/github/callback

# Frontend
FRONTEND_URL=http://localhost:5173
FRONTEND_AUTH_CALLBACK_URL=http://localhost:5173/auth/callback

# Redis / BullMQ
REDIS_URL=redis://localhost:6379
```

Levanta Redis y Postgres, aplica las migraciones de Prisma y arranca el servidor:

```bash
docker-compose up -d
npx prisma migrate dev
npm run dev
```

El backend quedará disponible normalmente en:

```
http://localhost:3000
```

### Jenkins con Docker

El repositorio incluye una instalación local de Jenkins sobre Docker para ejecutar el pipeline de CI definido en `Jenkinsfile`.

```bash
docker-compose -f docker-compose.jenkins.yml up -d --build
```

Jenkins quedará disponible en:

```
http://localhost:8080
```

La guía completa está en [`docs/JENKINS_DOCKER.md`](docs/JENKINS_DOCKER.md).

---

## Uso básico

En esta etapa el frontend puede ejecutarse con datos simulados para construir y validar la experiencia de usuario mientras el backend y el juez terminan de integrarse.

Flujo esperado:

1. Abrir la aplicación en el navegador.
2. Explorar la lista de problemas disponibles.
3. Entrar al detalle de un problema.
4. Revisar el enunciado y la interfaz de solución.
5. Enviar una solución y ver cómo se encola y se resuelve su resultado.

A medida que avance el backend y el juez en línea, este flujo se conecta con datos reales y ejecución controlada de código a través de la cola de BullMQ.

---

## Documentación

La documentación ampliada del proyecto vive en [`docs/`](docs/):

- [Roadmap](docs/roadmap.md)
- [Arquitectura](docs/architecture.md)
- [Frontend](docs/frontend.md)
- [Juez en línea](docs/judge.md)
- [API](docs/api.md)
- [Guía de contribución](docs/contributing.md)
- [Decisiones técnicas](docs/decisions/)

---

## Contribución

Las contribuciones son bienvenidas, especialmente en documentación, interfaz, estructura del proyecto, backend/juez y mejoras de experiencia de usuario.

Antes de contribuir:

1. Revisa la documentación del proyecto en [`docs/`](docs/).
2. Trabaja desde una rama separada (`feature/...`, `fix/...`).
3. Envía tus cambios mediante *pull request* para mantener un flujo ordenado.

La guía completa de contribución está en [`docs/contributing.md`](docs/contributing.md).

---

## IEEE Computer Society — Rama Estudiantil UNI

Codenix es uno de los proyectos impulsados por **IEEE Computer Society (CS), capítulo de la Rama Estudiantil IEEE de la Universidad Nacional de Ingeniería**, orientado a fomentar la computación, la programación y el desarrollo de software entre estudiantes.

Si eres parte de la comunidad UNI (o simplemente te gusta programar) y quieres sumarte al desarrollo, revisa la guía de contribución o escríbenos a través de los canales de IEEE CS UNI.

---

## Licencia

Este proyecto está bajo la licencia **MIT**. Puedes usar, copiar, modificar y distribuir el código libremente, siempre que conserves el aviso de copyright. Consulta el archivo [`LICENSE`](LICENSE) para el texto completo.