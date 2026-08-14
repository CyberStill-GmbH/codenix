# MASTER DESIGN — Codenix

## 1. Alcance y decisión de producto

Este documento es la fuente de verdad de diseño para Codenix. El repositorio describe una plataforma de programación competitiva (no un SaaS financiero); por ello las decisiones principales responden a una herramienta de aprendizaje y productividad para desarrolladores: lectura prolongada, escritura de código, progreso y resultados del juez.

Si el producto evoluciona hacia finanzas, se puede conservar este sistema y sustituir únicamente los tokens semánticos de dominio y las visualizaciones por los indicados en la sección 12. No se recomienda adoptar una estética de trading para la experiencia actual: añadiría ruido y disminuiría la legibilidad del entorno de resolución.

## 2. Dirección visual recomendada

**Estilo: Minimalismo técnico oscuro, con glassmorphism funcional y contenido primero.**

La aplicación ya posee una buena base para esta dirección: superficies azul-marino, acentos cyan, `backdrop-filter` reservado para navegación/paneles flotantes y una familia mono para código. La recomendación no es un glassmorphism total: el efecto de vidrio debe separar capas temporales (navbar, menú, buscador, hoja móvil) y no convertirse en el fondo de cada tarjeta, tabla o editor.

- Base: superficies opacas y jerarquía de 3 niveles para mantener foco en problema, editor y resultado.
- Vidrio: sólo overlays y navegación fija; borde sutil, blur de 12–18 px y fondo con opacidad alta suficiente para conservar contraste.
- Profundidad: usar bordes y elevación antes que glow. El glow de marca queda para foco, CTA principal y estado de éxito puntual.
- Densidad: media-alta en zonas de trabajo; más respiración en landing, autenticación y perfil.
- Iconografía: Lucide, trazo consistente de 1.75–2 px; nunca emoji como icono de interfaz.

Evitar: fondos blancos puros en tema claro, gradientes en datos, más de un acento brillante por vista, sombras excesivas y tarjetas translúcidas apiladas.

## 3. Paleta semántica

Los tokens actuales de `frontend/src/styles/theme.css` son una base acertada. Se recomienda mantenerlos como única fuente de color y completar su contrato semántico:

| Uso | Oscuro | Claro | Token recomendado |
| --- | --- | --- | --- |
| Fondo de aplicación | `#050914` | `#F1F5F9` | `--color-bg` |
| Superficie principal | `#0D182B` | `#FFFFFF` | `--color-surface` |
| Superficie elevada | `#172842` | `#FFFFFF` | `--color-surface-elevated` |
| Texto principal | `#F8FAFC` | `#0F172A` | `--color-text` |
| Texto secundario | `#CBD5E1` | `#475569` | `--color-text-soft` |
| Marca / acción principal | `#0B7FC3` | `#0369A1` | `--color-primary` |
| Acento / información | `#38BDF8` | `#0EA5E9` | `--color-accent` |
| Éxito / Accepted | `#22C55E` | `#16A34A` | `--color-success` |
| Advertencia / pendiente | `#FBBF24` | `#D97706` | `--color-warning` |
| Error / Wrong Answer | `#EF4444` | `#DC2626` | `--color-error` |

Reglas:

- Texto normal debe alcanzar 4.5:1; controles, bordes y foco significativo 3:1 como mínimo.
- Los veredictos no deben depender sólo del color: acompañarlos de etiqueta textual, icono y, donde haya tablas, estado legible por lector de pantalla.
- Las dificultades `easy`, `medium` y `hard` deben conservar texto explícito y no usar sólo puntos de color.
- Declarar tokens por intención (`--color-verdict-ac`, `--color-difficulty-medium`) y no valores hexadecimales dentro de componentes.

## 4. Tipografía para Tailwind CSS

**Emparejamiento recomendado: Space Grotesk + Inter + JetBrains Mono.** Ya se refleja en los tokens existentes y es más adecuado que usar monoespaciada en toda la interfaz: aporta carácter a la marca, comodidad en lectura y precisión en código.

```css
/* frontend/src/styles/globals.css */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap');

@theme {
  --font-sans: Inter, ui-sans-serif, system-ui, sans-serif;
  --font-display: "Space Grotesk", Inter, ui-sans-serif, sans-serif;
  --font-mono: "JetBrains Mono", "Cascadia Code", Consolas, monospace;
}
```

- `font-display`: landing, títulos de página y métricas clave; 600–700, tracking `-0.02em` sólo en H1–H3.
- `font-sans`: cuerpo, formularios, tablas y navegación; tamaño base mínimo 16 px, line-height 1.5.
- `font-mono`: editor, snippets, IDs y valores técnicos; nunca para párrafos extensos ni navegación.
- Escala: 12 / 14 / 16 / 18 / 20 / 24 / 30 / 36 / 48 / 60 px, usando los `clamp()` actuales para titulares fluidos.

## 5. Tokens de layout y forma

- Retícula: 4 px como unidad; espaciado habitual 8, 12, 16, 24, 32, 48 y 64 px. Los tokens existentes ya la cubren.
- Anchos: contenido de lectura 65–75 caracteres; shell máximo 1440 px; no forzar 90rem en pantallas menores de 1024 px.
- Breakpoints de verificación: 375, 768, 1024 y 1440 px. En móvil, reservar espacio inferior para `app-mobile-nav` con `padding-bottom` en cada zona scrollable.
- Radios: reducir la dispersión. Usar 6 px para campos/chips, 8 px para botones/tablas, 12 px para cards y 16 px sólo para overlays/hojas móviles. Un chip no debe parecer una card.
- Elevación: `--shadow-sm` para controles, `--shadow-md` para cards elevadas y `--shadow-floating` para menú/hoja. No usar shadow y glow fuertes simultáneamente.

## 6. Especificación de componentes

| Componente | Reglas de diseño | Mejora prioritaria |
| --- | --- | --- |
| Botón | Altura mínima 40 px desktop / 44 px táctil; una acción primaria por bloque; carga conserva ancho y anuncia estado. | Añadir `aria-busy`/spinner accesible y variantes de estado `pressed` donde aplique. |
| Icon button | Caja interactiva mínima 40×40 (44×44 móvil), tooltip y `aria-label`. | No usar un icono sin nombre accesible. |
| Input / textarea | Label visible, ayuda y error junto al campo; error después de blur o submit. | Añadir estado error semántico y `aria-describedby`; evitar placeholder como label. |
| Selectores y filtros | Deben ser `<button>`/`<select>` nativos o exponer `aria-pressed`/`aria-selected`. | Revisar chips clicables para que el estado sea anunciable y navegable por teclado. |
| Badge | Sólo comunicación de estado; no debe recibir foco si no es interactivo. | `Badge.tsx` usa estilos focus pese a ser un `div`; eliminar ese foco o convertirlo en botón cuando active una acción. |
| Cards | Cabecera, contenido y acción claros; evitar cards dentro de cards salvo agrupación real. | Unificar `--radius-card` con radio de cards reutilizables. |
| Tablas | Cabecera sticky sólo si no tapa foco; filas seleccionables con affordance visible. | Añadir `scope`, `aria-sort`, estado vacío, skeleton y alternativa compacta en móvil. |
| Editor / panel de resultado | Paneles redimensionables con alternativa de botones y persistencia de tamaño. | Proteger foco durante resize y no depender exclusivamente de arrastrar. |
| Modales, dropdowns y hojas | Foco atrapado, Escape, retorno de foco al trigger y cierre inequívoco. | Validar el menú de usuario y menús legales con teclado, fuera de clic y foco no oculto. |
| Skeleton, vacío y error | Misma geometría que contenido final; error explica causa y ofrece reintento. | Mantener `aria-live="polite"` para actualizaciones sin robar foco. |

## 7. Navegación y flujos

- Navegación primaria consistente: escritorio con navbar/side navigation, móvil con un único patrón de navegación de primer nivel y máximo cinco destinos.
- Señalar la ruta activa con color, peso e indicador; el color no debe ser el único cambio.
- Mantener filtros, posición de scroll y texto de búsqueda al volver de detalle a lista.
- Tras cambios de ruta, enviar foco al `main` (por ejemplo, un `h1` con `tabIndex={-1}`) para personas que navegan con teclado/lector.
- En el flujo Problemas → detalle → código → resultado, priorizar la siguiente acción explícita: “Ejecutar”, “Enviar”, “Ver resultado” o “Corregir”. No mostrar todas con el mismo énfasis.
- Formularios admin largos: secciones con encabezado, autosave de borrador, aviso de cambios sin guardar y resumen de errores enlazable tras un submit inválido.

## 8. Datos, progreso y visualizaciones

- Tendencia temporal: línea; comparación por tema/dificultad: barras horizontales; progreso contra meta: barra/bullet chart; proporción de problemas resueltos: donut sólo para 2–5 categorías.
- Toda gráfica debe tener título, leyenda cercana, tooltip también accesible con teclado, texto-resumen y tabla/fallback de valores.
- Ejes con unidades, formatos locales para número/fecha y rejillas sutiles. Nunca usar degradados o sombras fuertes sobre las series.
- En móvil: menos ticks, barras horizontales cuando sea necesario y área táctil >=44 px.
- Los estados de carga, vacío y error se diseñan para cada gráfica; no dejar ejes vacíos.

## 9. Movimiento y feedback

**Principio:** el movimiento debe comunicar jerarquía, cambio de estado o causalidad; nunca ser decoración constante dentro del workspace.

| Caso | Duración / curva | Regla |
| --- | --- | --- |
| Hover, foco, pressed | 120–160 ms, `ease-out` | Color, borde u opacidad; no desplazar layout. |
| Dropdown / tooltip | 160–200 ms, `--ease-out-quint` | Fade + desplazamiento de 4–8 px. |
| Cambio de ruta o sección | 200–320 ms, `--ease-out-expo` | Opacidad + Y de 8–12 px como máximo. |
| Resultado del juez | inmediato para texto + 200 ms para panel | Priorizar feedback textual y estado; no esperar animación para mostrar información. |
| Datos / gráficos | 250–400 ms, una vez | Revelar al cargar; nunca reanimar con cada filtro ni esconder datos sin JS. |

Cambios recomendados:

- Mantener `Reveal` sólo para entrada inicial de sección; no aplicarlo a contenido que cambia por polling o actualizaciones frecuentes.
- Añadir una regla global `@media (prefers-reduced-motion: reduce)` que desactive también auroras, estrellas, meteoros, floats y transiciones globales, no sólo unas clases concretas.
- El carrusel/marquee social actual debe pausar en hover **y foco**, disponer de control Pausar/Reanudar y quedar inmóvil con reducción de movimiento.
- Evitar transicionar `max-height` en menús si puede producir reflow perceptible; preferir `opacity`/`transform` con altura determinada o dialog/accordion semántico.
- Theme switch: respetar reducción de movimiento y limitar la transición global para no animar SVG/canvas/gráficas innecesariamente.

## 10. Accesibilidad: criterios no negociables

- Foco visible de 2 px con offset de 2–3 px y contraste >=3:1. `focus-visible` es el patrón por defecto; no eliminar outline sin reemplazo.
- Añadir `scroll-padding-top` equivalente al header sticky para que el foco no quede cubierto.
- Orden de tabulación igual al orden visual; todos los controles operables sin ratón.
- Labels visibles, `autocomplete` correcto en auth, pegado permitido en contraseñas y mensajes de error que indiquen causa y solución.
- Objetivos táctiles >=44×44 px. El botón `sm` de 32 px sólo debe utilizarse donde no sea destino táctil principal; en móvil promoverlo a 44 px o ampliar su área.
- `prefers-reduced-motion`, contraste de ambos temas, zoom al 200% y navegación completa por teclado se verifican antes de liberar.
- No comunicar estado exclusivamente con color, icono, hover o arrastre.

## 11. Auditoría inicial del código existente

Fortalezas observadas:

- `theme.css` ya centraliza color, tipografía, espaciado, sombras, z-index y temas; es la base correcta para escalar.
- Los componentes `Button` e `Input` incorporan `focus-visible` y estados disabled.
- Existen placeholders, estados de error/vacío y una variante móvil de navegación con safe-area.
- Se usa Lucide y se declara `prefers-reduced-motion` para una parte de las animaciones.

Prioridad alta:

1. Completar reducción de movimiento: las animaciones decorativas de `globals.css` (estrellas, meteoros, aurora y floats) no quedan todas cubiertas por la media query actual.
2. Elevar objetivos táctiles en móvil: `Button` `sm` mide 32 px y los ítems/acciones compactas deben alcanzar 44 px cuando sean táctiles.
3. Corregir semántica de `Badge`: un `div` no interactivo no necesita estilos de foco.
4. Verificar contraste compuesto de texto/bordes sobre superficies con blur, especialmente `--color-glass-bg` y los estados secundarios.
5. Garantizar foco visible y no oculto bajo navbar/footer fijo; añadir `scroll-padding-top` y bottom padding en todos los layouts scrollables.

Prioridad media:

1. Consolidar radios y reducir la mezcla actual de 4, 6, 8, 12, 16, 20 y 24 px por componente.
2. Añadir estados de carga accesibles y feedback de solicitud en botones de Run/Submit.
3. Auditar tablas, filtros, resize del workspace y dropdowns con teclado, lector de pantalla y pantalla de 375 px.
4. Evitar que la landing visualmente rica establezca el tono del editor: el workspace debe ser más silencioso, estable y denso.

## 12. Variante si el producto fuese un SaaS financiero

Conservar layout, tipografía y accesibilidad. Cambiar únicamente la semántica de dominio:

- Primario: azul `#2563EB`; información: cyan `#0891B2`; positivo: `#16A34A`; negativo: `#DC2626`; advertencia: `#B45309`.
- Usar verde/rojo junto con flecha, signo +/− y etiqueta (“sube 2.4%”, “baja 1.8%”).
- OHLC/candlestick sólo para precios de inversión; línea para evolución de saldo y barras/bullet para presupuestos y metas.
- Valores con moneda/locale explícitos, fecha/hora de actualización y una distinción visual clara entre datos reales, estimados y pendientes.
- En acciones irreversibles (transferir, borrar cuenta, publicar), mostrar confirmación, resumen de impacto y posibilidad de deshacer cuando sea viable.

## 13. Secuencia de implementación

1. Cerrar accesibilidad transversal: reduced motion completo, foco no oculto, targets táctiles y semántica de badges/filtros.
2. Consolidar tokens de radio, elevación y estados interactivos en los componentes compartidos.
3. Auditar el workspace de código y flujos Run/Submit con teclado, móvil y estados de red lentos.
4. Revisar perfil, progreso, tablas y gráficas con sus alternativas textuales/tabla.
5. Aplicar polish de landing después de que las vistas de trabajo y administración cumplan el sistema.

## 14. Checklist de aceptación

- [ ] Probado a 375, 768, 1024 y 1440 px; sin scroll horizontal accidental.
- [ ] Probado en temas oscuro y claro, zoom 200% y `prefers-reduced-motion`.
- [ ] Todo control interactivo tiene nombre accesible, foco visible y operación por teclado.
- [ ] Texto >=4.5:1 y UI no textual importante >=3:1 en su superficie compuesta real.
- [ ] Estados de loading, vacío, error, éxito y disabled existen y son comprensibles.
- [ ] Filtros, tablas, modales y paneles redimensionables tienen alternativa no dependiente de hover/arrastre.
- [ ] Gráficas exponen leyenda, valores, insight textual y alternativa tabular.
- [ ] No hay colores, sombras, radios, duraciones o hexadecimales arbitrarios fuera del sistema de tokens.
