<p align="center">
  <img src="docs/docs-img/codenix.png" width="10%" alt="Cabecera del proyecto">
</p>

<div align="center">

# Codenix

**Plataforma web para practicar programación competitiva y algoritmos.**
Problemas, envíos de soluciones, ejecución de código y seguimiento de progreso — todo en un solo lugar.

Un proyecto de **IEEE Computer Society — Rama Estudiantil UNI**

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
