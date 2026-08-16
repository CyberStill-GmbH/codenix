# Datos y persistencia

PostgreSQL es la fuente de verdad del dominio y Prisma administra su esquema y migraciones.

## Áreas del modelo

| Área | Entidades principales |
| --- | --- |
| Identidad | `User`, `OAuthAccount`, `PasswordResetToken` |
| Catálogo | `Problem`, `Topic`, `ProblemTopic`, `ProblemExample`, `ProblemCodeTemplate`, `Testcase` |
| Evaluación oficial | `Submission`, `SubmissionTestcaseResult` |
| Ejecución de prueba | `CodeRun`, `CodeRunTestcaseResult` |

## Principios de integridad

- Usuarios, correos, nombres de usuario, slugs y números de problema son únicos.
- Las plantillas son únicas por problema y lenguaje.
- Las relaciones problema-tema y envío-caso de prueba tienen claves compuestas para evitar duplicados.
- Los resultados por caso pertenecen a una única ejecución o envío y se eliminan junto a su padre cuando corresponde.
- Los problemas publicados deben contar con casos y plantillas compatibles con los lenguajes que se exponen. Esta validación se aplica en la capa de administración y se cubre con pruebas.

## Migraciones y semillas

- Las migraciones son el único mecanismo para cambiar el esquema en entornos compartidos.
- Antes de aplicar una migración, probarla contra una copia representativa de datos y confirmar su compatibilidad con la versión de API desplegada.
- Las semillas sirven para desarrollo y pruebas; no sustituyen una migración ni deben introducir problemas publicados incompletos.

Consulte [desarrollo](development.md) para los comandos locales y [ADR-0003](decisions/0003-postgresql-source-of-truth.md) para el motivo de esta separación.
