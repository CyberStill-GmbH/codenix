# J-006: Área de trabajo temporal

**Estado:** Propuesto

El `Workspace` centraliza creación de directorios temporales, escritura de archivos, rutas de artefactos y eliminación final. Los runners declaran nombres y comandos; no crean ni borran directorios directamente.

## Invariantes

- Cada trabajo recibe un directorio único bajo una raíz controlada.
- No se aceptan rutas proporcionadas por usuarios.
- La limpieza se ejecuta en una cláusula final y tolera recursos parcialmente creados.
- Los artefactos no salen del workspace salvo que una política explícita lo autorice.

Esta separación reduce duplicación y prepara el camino para cachés de compilación sin mezclar archivos temporales con artefactos reutilizables.
