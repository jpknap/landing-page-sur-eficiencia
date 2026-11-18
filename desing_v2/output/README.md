# Sur Eficiencia: propuestas web (desing_v2)

Dos propuestas construidas **solo** con los documentos de `desing_v2/` e **independientes de `desing_v1/output`**: comparten contenido y requisitos, pero no su diseño.

| Carpeta | Brief | Dirección |
|---|---|---|
| `propuesta-01/` | `desing_v2/desing_prompt_v1.md` | Editorial y fotográfica, sin 3D |
| `propuesta-02/` | `desing_v2/desing_prompt_v2.md` | Arquitectónica y técnica, con una escena Three.js en la portada |

**Guía aplicada:** `desing_v2/style-guide-summary.md` (v0.2), con acento **Turquesa Cotizar `#2BB3C0`** reservado a la acción de cotizar y texto Azul Sur encima (5,09:1). Los prompts todavía mencionan «blanco hueso», pero declaran la guía como fuente de verdad para los colores, así que se aplicó el turquesa. El blanco hueso no aparece en ningún archivo de esta carpeta.

## Publicar en un servidor

El build listo para subir está en **`dist/`** (también comprimido en **`sur-eficiencia-desing-v2.zip`**). Es un sitio estático: no necesita PHP, Node ni base de datos.

```
dist/
├── index.html          ← página de entrada con acceso a las dos propuestas
├── robots.txt          ← bloquea buscadores mientras indexar=false
├── propuesta-01/       ← index.html, styles.css, js/, vendor/, img/
└── propuesta-02/
```

- **Subir:** copie el contenido de `dist/` a la carpeta pública del hosting (`public_html/`, `www/`, un bucket o Netlify/Vercel arrastrando la carpeta). Las rutas son relativas, así que también funciona dentro de una subcarpeta.
- **Volver a generar** tras un cambio: `npm install` (solo la primera vez) y `npm run dist`. Eso compila el CSS, copia solo las imágenes usadas, versiona CSS y JS (`?v=hash`) para que el navegador no muestre archivos viejos, quita los comentarios internos, verifica que no haya rutas rotas y crea el `.zip`.
- **`sitio.config.json`** controla el build:

| Campo | Uso |
|---|---|
| `whatsapp` | Número con código de país, por ejemplo `"+56 9 1234 5678"`. **Vacío = los botones de WhatsApp no aparecen** (no se publica un enlace ficticio). |
| `mensajeWhatsapp` | Texto con el que se abre la conversación. |
| `indexar` | `false` (por defecto) mantiene `noindex` y `robots.txt` para revisión con el cliente; `true` para la publicación definitiva. |
| `titulo`, `bajada`, `propuestas` | Textos de la página de entrada. |

  También se puede indicar en el momento: `npm run build && node scripts/dist.mjs --whatsapp="+56 9 1234 5678"`.

## Cómo revisarlas en local

```bash
cd desing_v2/output
npm run serve        # http://localhost:4173/propuesta-01/  y  /propuesta-02/
# opcional, para recompilar:
npm install && npm run build
npm run logo         # recortes del logo desde /logo.png (requiere Pillow)
```

- **Propuesta 01** también se puede abrir con doble clic en `index.html`.
- **Propuesta 02** necesita `npm run serve` para la escena 3D. Con doble clic muestra la alternativa estática y todo lo demás funciona igual.

Stack: HTML estático + Tailwind CSS 3.4 + íconos Lucide 0.460 (solo los usados) + Three.js 0.170 (solo en la 02). `src/main.js` es el mismo archivo en ambas propuestas y cada módulo se activa solo si su elemento existe.

## Separación entre secciones

Cada sección tiene un fondo distinto de la anterior, con un filete de 1 px donde dos fondos claros se tocan. Así ningún bloque se funde con el siguiente:

| Sección | Propuesta 01 | Propuesta 02 |
|---|---|---|
| Portada | Blanco | **Azul, plano con retícula** y regla graduada |
| Servicios | **Niebla** | Blanco |
| Cómo trabajamos | **Azul** | **Niebla con retícula** |
| Nosotros | Blanco | Blanco |
| Contacto | **Niebla** | **Azul, plano** |
| Pie | **Azul** (logo sobre placa blanca) | Blanco (logo a color) + franja niebla |

## Propuesta 01: editorial y fotográfica

- **Portada:** titular editorial grande a la izquierda y, a la derecha, el texto con «Solicitar cotización». Debajo va un **tríptico fotográfico** (Viviendas, Terreno, Infraestructura) que resume los ámbitos de trabajo, cada foto con su leyenda «Imagen referencial».
- **Servicios con índice fijo:**
  - En escritorio, la columna izquierda queda fija con el título y un índice que marca el servicio que se está leyendo. A la derecha, las fichas de cada servicio están separadas por filetes, sin tarjetas.
  - En móvil, el índice pasa a una fila deslizable fija bajo el encabezado y el chip activo se centra solo.
  - Cada ficha tiene fotografía (recortes de detalle, para no repetir las del tríptico) o una ilustración técnica, descripción, «Qué incluye» con marcas de verificación y su botón de cotizar.
- **Cómo trabajamos:** banda azul con tres pasos numerados. Una línea blanca se traza uniéndolos y los pasos aparecen en orden.
- **Nosotros:** declaración tipográfica amplia y tres principios con íconos.
- **Contacto:** formulario de **una columna**, más rápido de completar, con el botón de envío a todo el ancho.
- **Progreso de lectura:** un filete verde bajo el encabezado avanza con el desplazamiento.

## Propuesta 02: arquitectónica y técnica

- **Portada en plano azul:** retícula de 24/96 px, regla graduada en el borde y la volumetría 3D a la derecha con la leyenda «Visualización conceptual».
  - Los techos llevan aristas blancas para leerse sobre el azul.
  - La alternativa estática (SVG isométrico) tiene la misma composición y colores.
  - Mantiene el render bajo demanda, la pausa fuera de pantalla o con la pestaña oculta, el `pixelRatio` ≤ 1,5, la liberación de recursos y la imagen estática en móvil, con movimiento reducido o sin WebGL.
- **«Cuadro de servicios»:** una tabla desplegable (acordeón).
  - **Filas:** cada una muestra ícono, nombre, un resumen y un control +/–. Al abrirse, el contenido se despliega en 250 ms con la imagen o ilustración, la descripción, la tabla de prestaciones y el botón de cotizar.
  - **Apertura:** la primera fila viene abierta. Los enlaces del menú, del submenú y del pie abren la fila correspondiente.
  - **Accesibilidad:** cada fila es un botón con `aria-expanded` y `role="region"`. El contenido cerrado no recibe foco, y sin JavaScript todas las filas quedan abiertas.
- **Cómo trabajamos sobre ejes de plano:** burbujas numeradas como ejes de un plano estructural, unidas por una cota que se traza al aparecer. Bajo cada burbuja, un eje punteado baja hasta su contenido.
- **Nosotros:** tabla de principios con íconos.
- **Contacto:** sobre plano azul, con el formulario en un panel blanco con encabezado («Solicitud de cotización · Todos los campos son obligatorios»).
- **Pie blanco:** el logo a color sobre su fondo natural.

## Animaciones (orientadas a transmitir seguridad)

- **Siempre iguales y predecibles:** fundido + 16 px hacia arriba, **250 ms ease-out** (token de la guía), en secuencias ordenadas con 60–120 ms entre piezas. No hay rebotes, giros ni paralaje.
- **Movimiento que muestra estructura:** las fotos de la 01 se descubren de abajo hacia arriba sin filtros, y las líneas de proceso de ambas se trazan en el orden de lectura.
- **Respuesta a cada acción:** subrayado o filete en el menú, contorno azul en el botón turquesa al pasar el puntero y leve hundimiento al presionar, +/– en el acordeón, halo azul en los campos con foco y errores con ícono y texto.
- **El contenido nunca queda oculto:** sin JavaScript, con `prefers-reduced-motion: reduce`, al imprimir o si el foco del teclado llega a una pieza aún no revelada, todo se muestra al instante.

## Experiencia de usuario común

- **Barra de cotización en móvil:** aparece al pasar la portada y se oculta en el formulario, en el pie y con el menú abierto. Respeta el área segura del iPhone.
- **Navegación:** la sección activa se marca en el menú, el menú móvil se cierra al elegir un enlace y tiene desplazamiento propio en pantallas bajas, y el submenú se cierra con Esc o con clic fuera.
- **Cotizar:** cada botón de servicio preselecciona ese servicio en el formulario y lleva el foco a «Nombre».
- **Formulario:** validación accesible que enfoca el primer error. Con datos válidos avisa que es una demostración y **no simula un envío**.

## Suposiciones

1. **Trato:** se usa «usted» (`voice.address` está pendiente).
2. **Logo:** la versión horizontal del encabezado (isotipo + nombre, sin bajada) es una derivación del logo apilado. Debe validarla el cliente.
3. **Prestaciones:** solo las de `estructura navegacion.md`. «Nosotros» no menciona formación profesional porque no hay datos.
4. **«Cómo trabajamos»** (consulta inicial → revisión del requerimiento → propuesta técnica): **es contenido propuesto y debe validarse.**
5. **Ilustraciones:** subdivisión y agua potable y alcantarillado no tienen fotografía con licencia adecuada, así que llevan **ilustraciones técnicas** rotuladas «Ilustración referencial». No representan proyectos reales.
6. **Botón turquesa sobre blanco:** el borde contrasta unos 2,4:1 con el fondo. El botón se identifica por su texto azul (5,09:1) y en hover gana un contorno azul de 2 px.
7. **Encabezado entre 1024 y 1199 px:** el botón de cotizar del encabezado se oculta porque no cabe junto al menú. La acción sigue en la portada y en cada servicio.

## Contenido por validar con el cliente

- Problema, propuesta de valor, prueba y cobertura territorial: se omitieron.
- **WhatsApp:** funciona con un **número de prueba** (+56 9 0000 0000). Falta el número real del cliente. **Correo electrónico:** sin dato, no se publica.
- Trato usted/tú, formación profesional, fotografías reales (`imagery.source`), logo en SVG y aprobaciones (`decisions[0..1].approved_by`).

## Imágenes referenciales (Wikimedia Commons)

Sin filtros ni capas de color, solo recortadas. Los recortes `*-detalle.jpg` salen de los mismos originales. No representan trabajos de Sur Eficiencia.

| Archivo | Original | Autor | Licencia |
|---|---|---|---|
| `img/vivienda.jpg`, `img/vivienda-detalle.jpg` | [File:Casa K1.JPG](https://commons.wikimedia.org/wiki/File:Casa_K1.JPG) | Ccaba77 (Christian Caba) | CC BY-SA 3.0 |
| `img/topografia.jpg`, `img/topografia-detalle.jpg` | [File:Trimble Total Station DR 200 01 (fcm).jpg](https://commons.wikimedia.org/wiki/File:Trimble_Total_Station_DR_200_01_(fcm).jpg) | Frank C. Müller | CC BY-SA 4.0 |
| `img/pavimentacion.jpg`, `img/pavimentacion-detalle.jpg` | [File:Asphalt paving.jpg](https://commons.wikimedia.org/wiki/File:Asphalt_paving.jpg) | Stevolala1 | CC BY-SA 4.0 |
| `img/aguas-lluvias.jpg` | [File:Storm drain pipe.JPG](https://commons.wikimedia.org/wiki/File:Storm_drain_pipe.JPG) | Anonimski | CC0 |

Las licencias CC BY-SA exigen atribución si se publica, y los recortes son obras derivadas bajo la misma licencia. Lo recomendable es reemplazarlas por fotos propias.

## WhatsApp (en las dos propuestas)

> **Número de prueba activo:** `sitio.config.json` tiene **+56 9 0000 0000** (ficticio y no asignado) para revisar el diseño. **Reemplácelo por el número real y ejecute `npm run dist` antes de publicar.** El build avisa con ⚠ mientras siga el de prueba.

- **Color oficial de WhatsApp** (`#25D366`), a pedido del cliente para que destaque. Es la única excepción a la paleta de la guía.
- **Botón flotante:** abajo a la derecha, verde oficial con el ícono en blanco, como el logo. Al pasar el puntero o con el foco del teclado pasa al verde oscuro oficial (`#075E54`) y despliega «WhatsApp» en blanco (7,7:1).
  - **Visible desde que se abre la página** («WhatsApp siempre a mano», según la guía).
  - Se oculta solo donde ya hay otro acceso: en Contacto, en el pie y con el menú móvil abierto.
- **En Contacto:** un bloque «¿Prefiere conversar?» con el botón «Escribir por WhatsApp», en verde oficial con texto grafito (7,7:1; el blanco sobre ese verde no alcanza contraste). Responde a «acceso directo a WhatsApp» de `estructura navegacion.md`.
- **Ícono:** Lucide no incluye logos de marca, así que se compuso uno en estilo línea de 2 px (burbuja + auricular).
- **Comportamiento:** abre `https://wa.me/<número>?text=<mensaje>` en una pestaña nueva, anunciado a lectores de pantalla.
- **Configuración:** el número vive en `sitio.config.json`, y `npm run dist` lo escribe tanto en `dist/` como en los `index.html` de trabajo, para que se vea igual al abrirlos directamente. Si el campo queda vacío, no se muestra ningún elemento de WhatsApp.
- **Móvil:** en la portada se ve el círculo flotante. Cuando aparece la barra inferior, el círculo cede su lugar al botón verde de WhatsApp de la barra, junto a «Solicitar cotización».
