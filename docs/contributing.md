# Contribución

Gracias por contribuir a Codenix. Los cambios deben ser pequeños, verificables y coherentes con la documentación existente.

## Flujo recomendado

1. Revisa [la documentación](README.md) y las especificaciones del área afectada.
2. Crea una rama con un objetivo acotado (`feature/...`, `fix/...` o `docs/...`).
3. Implementa el cambio y actualiza pruebas, migraciones o documentación relacionadas.
4. Ejecuta los controles locales del área:

   ```bash
   # backend/
   npm run typecheck
   npm test

   # frontend/
   npm run typecheck
   npm run lint
   npm run build
   ```

5. Abre un pull request con contexto, comportamiento antes/después, validación y riesgos.

## Cambios sensibles

- No incluyas secretos, tokens, dumps, archivos `.env`, logs ni artefactos generados.
- Los cambios de esquema se hacen con una migración Prisma y deben ser compatibles con la versión desplegada.
- Los cambios en ejecución, límites o permisos requieren pruebas y actualización de [seguridad](security.md) o del [juez](judge.md).
- Los cambios que introducen una decisión transversal requieren un ADR.
- Las imágenes de documentación deben ser optimizadas, tener nombres descriptivos y mantenerse dentro de `docs/docs-img/`.

## Commits y revisión

Usa mensajes descriptivos y limita cada commit a una intención. En la revisión se comprueba funcionalidad, regresiones, accesibilidad, seguridad, documentación y coste operativo.
