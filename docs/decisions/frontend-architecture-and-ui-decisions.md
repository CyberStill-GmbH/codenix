# Decisiones de arquitectura frontend y sistema visual

**Proyecto:** Codenix Frontend  
**Fecha:** 2026-06-17  
**Estado:** Vigente  
**Alcance:** Landing pública, autenticación, navegación interna, perfil de usuario y base visual del MVP.

## 1. Propósito del documento

Este documento registra las decisiones de diseño, arquitectura UI y organización frontend tomadas durante la construcción inicial del MVP de Codenix. Su objetivo es reducir deuda técnica futura, alinear criterios entre contributors y evitar que nuevas pantallas introduzcan estilos, patrones o estructuras inconsistentes.

La regla general es simple: **Codenix debe crecer desde un sistema visual común, no desde componentes aislados que resuelven cada pantalla por su cuenta.**

## 2. Stack y criterios base

El frontend usa React con TypeScript, Vite y Tailwind CSS. La decisión principal fue mantener Tailwind como herramienta de composición visual, pero centralizar la identidad del producto en variables CSS y tokens semánticos.

Esto evita tres problemas frecuentes:

- Colores hardcodeados repetidos en componentes.
- Radios, sombras y fondos inconsistentes entre secciones.
- Refactors costosos cuando cambie la paleta o la identidad visual.

Los componentes pueden usar clases Tailwind, pero deben consumir variables como `--color-primary`, `--radius-xl`, `--shadow-md`, `--font-display`, etc. Los estilos que expresan identidad de producto deben vivir en tokens, no dispersos en JSX.

## 3. Sistema de tokens

La fuente principal de verdad visual está en:

- `src/styles/theme.css`
- `src/features/landing/theme/tokens.ts`

`theme.css` define tokens CSS globales: color, tipografía, radios, sombras, spacing, gradientes, estados y accesibilidad.  
`tokens.ts` agrupa clases semánticas por zona: navbar, hero, footer y auth.

### Decisión

Mantener tokens CSS para valores primitivos y tokens TypeScript para combinaciones semánticas reutilizables.

### Motivo

Los tokens CSS son ideales para valores que el navegador debe resolver dinámicamente. Los tokens TypeScript son útiles para evitar strings visuales repetidos en componentes React.

### Implicación

Cuando se cree un componente nuevo, primero debe revisarse si existe un token semántico reutilizable. Si no existe, se puede crear uno, pero debe representar un patrón repetible y no una ocurrencia única.

## 4. Sistema tipográfico

Se decidió usar tres familias tipográficas con roles claros:

- **Display:** `Space Grotesk`, pesos 500-700.
- **Body/UI:** `Inter`, pesos 400-600.
- **Code:** `JetBrains Mono`, pesos 400-500.

Estas familias se importan desde Google Fonts en `index.html` y se exponen como:

- `--font-display`
- `--font-body`
- `--font-mono`

### Reglas

- Headlines principales, títulos de sección y badges destacados deben usar `--font-display`.
- Párrafos, navegación, formularios, botones y labels deben usar `--font-body`.
- Editor mock, snippets, breadcrumbs técnicos y métricas estilo código deben usar `--font-mono`.

### Detalle importante

Space Grotesk necesita un line-height más ajustado que Inter en títulos grandes. Por eso `--leading-tight` fue ajustado a `1.08`.

## 5. Paleta visual

La paleta principal del producto se consolidó alrededor de tonos fríos: azul, cian, superficies oscuras y grises azulados.

### Decisión

El naranja dejó de ser color estructural de interfaz y pasó a no formar parte del sistema principal de Codenix. El gradiente de marca se usa con moderación, principalmente en elementos de alto impacto.

### Reglas

- El color primario es azul/cian.
- Los estados semánticos pueden usar verde, rojo y amarillo solo cuando comunican estado real: accepted, error, pending, dificultad, etc.
- El gradiente no debe aplicarse a elementos secundarios como inputs, checkboxes, links o bordes comunes.
- El logo se renderiza en versión monocromática usando `--color-logo-mark`.

## 6. Landing pública

La landing se refinó por secciones, manteniendo el layout general aprobado:

- Hero con texto y CTAs a la izquierda.
- Mockup de producto a la derecha.
- Secciones de features, visión, problems engine, comunidad, CTA final y footer.

### Hero

El Hero fue modularizado en:

- `HeroBadge`
- `HeroHeadline`
- `HeroDescription`
- `HeroCTAs`
- `TrustBadges`
- `ProductMockupCard`
- `StatCard`
- `ProblemListItem`
- `ProgressBarRow`
- `FloatingBadge`

### Decisiones de UX

- El CTA principal debe ganar la jerarquía visual.
- El badge verde `live` del mockup fue reducido a un indicador neutral para evitar competir con el CTA.
- Las métricas del mockup usan una familia de acentos coherente, no colores aleatorios tipo semáforo.

## 7. Navbar pública vs navbar interna

Hay dos navbars distintas:

- `NavbarSection` / `Navbar`: landing pública.
- `AppNavbar`: aplicación autenticada interna.

### Decisión

No mezclar ambas navbars.

### Motivo

La landing tiene objetivos de conversión y navegación informativa. La app interna necesita navegación de producto, búsqueda y menú de usuario. Mezclarlas aumentaría acoplamiento y haría más difícil mantener estados activos, autenticación y contexto.

### Regla

`NavbarSection` no debe importar componentes del módulo autenticado.  
`AppNavbar` puede usar `UserAvatar` y `UserMenu`, pero no debe depender de secciones de landing.

## 8. Auth: Login y Register

Login y Register comparten un layout común:

- `AuthLayout`
- `AuthBrandPanel`
- `AuthMobileBrand`
- `AuthFormShell`
- `FormInput`
- `PasswordInput`
- `OAuthButton`
- `AuthSubmitButton`
- `AuthCheckbox`

### Decisión

Ambas pantallas deben compartir estructura y componentes. Solo cambia el contenido del formulario.

### Motivo

Esto reduce divergencia visual y hace más fácil conectar validaciones/API luego. También evita que Login y Register evolucionen como experiencias separadas.

### Branding

Se mantiene el video visual del panel de marca. El logo aparece monocromático y el texto `Training Hub` vive como acento de headline, no como parte del lockup superior.

## 9. Perfil autenticado

Se creó una primera base del módulo de usuario:

- `src/features/user/types/user.types.ts`
- `src/features/user/constants/userMockData.ts`
- `UserAvatar`
- `UserMenuAction`
- `UserMenu`
- `UserProfileCard`
- `UserStatsGrid`
- `UserProgressPanel`
- `UserRecentSubmissions`
- `ProfilePage`

### Decisión

Los componentes de usuario reciben datos por props. Solo la página `ProfilePage` importa mocks directamente.

### Motivo

Esto deja lista la migración hacia API real. Cuando exista backend, la página podrá reemplazar mocks por un hook como `useUserProfile()` sin reescribir componentes presentacionales.

### Endpoints previstos

Los mocks incluyen comentarios `TODO: API` para los futuros endpoints:

- `GET /api/users/me`
- `GET /api/users/me/stats`
- `GET /api/users/me/progress`
- `GET /api/submissions?userId={id}`
- `POST /api/auth/logout`
- `PATCH /api/users/me`

## 10. Datos mock

Los datos mock fueron definidos para una plataforma V1.0, no para una plataforma madura con miles de problemas.

### Decisión

Usar métricas realistas para una primera versión:

- 12-20 problemas resueltos.
- Decenas de envíos, no miles.
- Problemas con nombres propios de Codenix.
- IDs de problemas numéricos secuenciales: `1`, `2`, `3`, etc.

### Motivo

Los datos mock comunican producto. Si los números parecen irreales, la UI también se percibe menos creíble.

## 11. Problems Engine

El mockup de editor conserva una estructura familiar de ventana/editor, pero evita copiar clichés visuales como los puntos rojo/amarillo/verde de macOS.

### Decisión

Usar identidad propia en la barra superior: isotipo de Codenix + ruta técnica como `codenix://problems/{slug}`.

### Motivo

Se conserva familiaridad de editor sin que la UI parezca un template genérico.

## 12. Comunidad

La franja de redes sociales dejó de ser puramente decorativa y ahora tiene contexto textual.

### Decisión

Todo bloque visual debe comunicar su propósito.

### Motivo

Una hilera de íconos sin explicación genera ambigüedad. El texto contextual ayuda a entender que esos canales representan espacios de comunidad.

## 13. CTA final

El CTA final fue reescrito para cerrar el argumento de la landing, no repetir la propuesta de valor ya explicada en Visión.

### Decisión

El CTA final debe ser el momento de mayor claridad antes del footer.

### Motivo

La última impresión debe mover a la acción. Repetir copy reduce impacto y aumenta carga cognitiva.

## 14. Accesibilidad y estados UI

Se definieron estados visuales claros para:

- Focus.
- Error.
- Disabled.
- Hover.
- Active route.

### Reglas

- Inputs usan borde azul sólido en focus, no gradiente.
- Estados de error usan rojo semántico.
- Elementos deshabilitados deben verse claramente no interactivos.
- Targets táctiles principales deben tener altura mínima generosa.

## 15. Capturas recomendadas

No se incluyeron capturas dentro de este documento porque no tengo una fuente visual estable versionada en el repo. Para que este decision record sea más útil a futuros contributors, se recomienda agregar capturas en:

`docs/docs-img/frontend-decisions/`

### Capturas necesarias

1. **Landing - Hero completo**
   - Desktop, primer viewport.
   - Debe mostrar texto, CTAs, mockup y navbar pública.

2. **Landing - Problems Engine**
   - Desktop.
   - Debe mostrar el editor mock con la barra superior `codenix://problems/...`.

3. **Landing - Visión/Roadmap**
   - Desktop.
   - Debe mostrar las dos columnas con peso visual equivalente.

4. **Auth - Login**
   - Desktop.
   - Debe mostrar panel de video, logo monocromático y headline con `Training Hub`.

5. **ProfilePage**
   - Desktop.
   - Debe mostrar `AppNavbar`, profile card, stats, donut de progreso y envíos recientes.

6. **ProfilePage mobile**
   - Ancho aproximado 390px.
   - Debe comprobar que todo se apila sin overflow.

### Formato sugerido

```md
![Landing Hero](../docs-img/frontend-decisions/landing-hero-desktop.png)
![Profile Mobile](../docs-img/frontend-decisions/profile-mobile.png)
```

## 16. Reglas para cambios futuros

Antes de crear una nueva pantalla o componente, revisar:

1. Si existe un componente reutilizable.
2. Si existe un token semántico aplicable.
3. Si el componente pertenece a landing pública, auth o app interna.
4. Si el mock data debe vivir en `constants` y no dentro del componente.
5. Si el componente recibe datos por props para facilitar futura integración con API.

## 17. Riesgos conocidos

- Algunas rutas internas todavía están en fase de ensamblaje.
- Los mocks deben reemplazarse por hooks cuando exista backend.
- La documentación visual necesita capturas versionadas.
- Se debe evitar que nuevas features introduzcan colores fuera del sistema.

## 18. Resumen ejecutivo

Codenix ahora tiene una base frontend más sostenible: tokens, tipografía, componentes modulares, separación entre landing y app interna, mocks con intención de API y primeras pantallas autenticadas. La prioridad futura debe ser mantener esta disciplina mientras se conecta el backend y se completa el MVP.
