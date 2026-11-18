# Sur Eficiencia: propuestas web (desing_v1)

Dos propuestas independientes, construidas **solo** con los documentos de `desing_v1/`:

| Carpeta | Brief | Dirección |
|---|---|---|
| `propuesta-01/` | `desing_prompt_v1.md` | Editorial y fotográfica, sin 3D |
| `propuesta-02/` | `desing_prompt_v2.md` | Arquitectónica y técnica, con una escena Three.js en la portada |

Ambas aplican `style-guide-summary.md` (v0.2, acento **blanco hueso `#F1EBDD`**) y el menú de `estructura navegacion.md`. No se usó nada de `desing_v2/`.

## Publicar en un servidor

El build listo para subir está en **`dist/`** (también comprimido en **`sur-eficiencia-desing-v1.zip`**). Es un sitio estático: no necesita PHP, Node ni base de datos.

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
cd desing_v1/output
npm install          # solo si se quiere recompilar
npm run build        # íconos, Three.js local y CSS de Tailwind de ambas propuestas
npm run logo         # regenera los recortes del logo desde /logo.png (requiere Pillow)
npm run serve        # http://localhost:4173/propuesta-01/  y  /propuesta-02/
```

- **Propuesta 01** también se puede abrir directamente con doble clic en `propuesta-01/index.html`.
- **Propuesta 02** debe verse con `npm run serve`: los navegadores bloquean módulos JavaScript abiertos como archivo local. Si se abre con doble clic, la página funciona completa pero muestra la alternativa estática en lugar de la escena 3D.
- Los CSS compilados (`styles.css`) y `vendor/` ya están generados: no hace falta `npm install` para revisar.

Stack: HTML estático + Tailwind CSS 3.4 (CLI) + íconos Lucide 0.460 (solo los usados, en `vendor/icons.js`) + Three.js 0.170 (solo en la Propuesta 02). Las tipografías Manrope y Source Sans 3 se cargan desde Google Fonts.

## Propuesta 01: editorial y fotográfica

- **Idea:** se lee como un informe técnico bien maquetado: fotografía amplia, titulares en Manrope con buena jerarquía y filetes verdes de 1 px que ordenan el contenido en lugar de tarjetas.
- **Portada:** titular a la izquierda y foto a sangre hacia el borde derecho; debajo, una banda azul con la única acción en blanco hueso.
- **Servicios:** primero un índice con filetes (sin tarjetas). Luego cada servicio tiene su propia composición según su contenido: texto con imagen vertical, foto vertical con texto, bloque niebla con par fotográfico y prestaciones en tres columnas, y los dos últimos servicios en paralelo separados por un filete.
- **Cómo trabajamos:** tres pasos numerados (es una secuencia real). **Nosotros:** lista de definiciones. **Contacto:** columna azul más formulario.
- **Movimiento:** una sola entrada de la portada (250 ms) y transiciones de 150 ms en menús. Todo se desactiva con `prefers-reduced-motion`. No hay animaciones al desplazar.

## Propuesta 02: arquitectónica y técnica

- **Idea:** la página como **lámina de ingeniería**, con retícula de 48 px, marco con marcas de esquina, cotas y **cajetín** (el bloque de título de un plano). El cajetín azul aloja la acción de cotizar en blanco hueso, tanto en la portada como en el formulario.
- **Escena 3D:** una volumetría isométrica de un terreno dividido en tres lotes, con una vía, una red sanitaria discontinua, dos viviendas simples y un polígono con estacas de medición. Resume en una imagen los cinco servicios (terreno, subdivisión, pavimentación, red y vivienda). Lleva la leyenda «Visualización conceptual».
  - Cámara ortográfica. Solo hay una respuesta leve al puntero (±4° de azimut, solo con puntero fino); no hay giro continuo, partículas ni brillos.
  - Render bajo demanda: dibuja solo cuando cambia el puntero, se detiene fuera de pantalla (`IntersectionObserver`) y con la pestaña oculta (`visibilitychange`), y limita el `pixelRatio` a 1,5.
  - Se carga con `import()` dinámico en `requestIdleCallback`, sin bloquear el contenido. Libera geometrías, materiales y contexto en `pagehide`.
  - **Alternativa estática:** un SVG isométrico con la misma composición, visible mientras carga, en móvil (≤767 px o puntero táctil), con movimiento reducido, sin WebGL o si se pierde el contexto. El canvas aparece encima solo después de dibujar el primer cuadro.
  - Los materiales usan azul, verde, niebla, pizarra y blanco. El blanco hueso **no** se usa en el modelo.
- **Servicios:** una «planilla» con pestañas verticales accesibles (flechas, Inicio/Fin) y prestaciones en tabla. En móvil, los cinco paneles se muestran apilados.
- **Cómo trabajamos:** un perfil con nodos unidos por una línea.

## Suposiciones (soluciones conservadoras)

1. **Trato:** `voice.address` está pendiente; se usó **usted**, lo habitual en servicios profesionales en Chile.
2. **Logotipo:** se usa el logo del cliente (`/logo.png`). Ver «Iteración 2».
3. **Prestaciones:** solo las que aparecen en `estructura navegacion.md`. En agua potable y alcantarillado se separó «instalaciones sanitarias» en agua potable y alcantarillado, sin agregar alcances nuevos.
4. **«Nosotros»:** solo se dice que es un emprendimiento de ingeniería y consultoría y para quién trabaja. El enfoque se redactó a partir de la tabla «Somos / Pero no» de la guía. **No** se menciona formación profesional porque no hay datos.
5. **Botón de envío:** en la Propuesta 02, «Enviar solicitud» va en blanco hueso dentro del cajetín azul porque es la acción de cotizar. En la 01 es azul sobre blanco.
6. **Formulario:** no hay backend. La página avisa que es una demostración y, con datos válidos, muestra un mensaje informativo (no de éxito) diciendo que la solicitud **no** se envió.
7. **Paso «Cómo trabajamos»** (consulta inicial → revisión del requerimiento → propuesta técnica): **es contenido propuesto y debe validarse con el cliente.** No se marca en la interfaz.
8. **Menú:** se combinó lo pedido en el brief (Inicio, Servicios, Cómo trabajamos, Contacto) con `estructura navegacion.md` (cinco servicios y Nosotros). Servicios se despliega con los cinco servicios.

## Contenido por validar con el cliente

- Problema que resuelve, propuesta de valor y prueba (`essence.problem`, `value_proposition`, `proof`): se omitieron.
- Cobertura territorial (`essence.coverage`): no se menciona ninguna zona. La foto de la vivienda tampoco se identifica por lugar.
- **WhatsApp:** funciona con un **número de prueba** (+56 9 0000 0000). Falta el número real del cliente. **Correo electrónico:** sin dato, no se publica.
- Trato usted/tú (`voice.address`).
- Formación profesional del equipo (para «Nosotros»).
- Fotografías reales (`imagery.source`): termogramas, subdivisiones e instalaciones sanitarias tienen placeholders explícitos.
- Logotipo en vector (SVG) y validación de la versión horizontal del encabezado.
- Aprobaciones pendientes (`decisions[0..1].approved_by`).
- Validar la secuencia «Cómo trabajamos».

## Imágenes referenciales (Wikimedia Commons)

Todas llevan la leyenda visible «Imagen referencial». Se muestran sin filtros ni capas de color, solo recortadas y redimensionadas. No representan trabajos de Sur Eficiencia.

| Archivo | Original | Autor | Licencia | Uso |
|---|---|---|---|---|
| `img/vivienda.jpg` | [File:Casa K1.JPG](https://commons.wikimedia.org/wiki/File:Casa_K1.JPG) | Ccaba77 (Christian Caba) | CC BY-SA 3.0 | 01: portada · 02: diagnóstico térmico |
| `img/topografia.jpg` | [File:Trimble Total Station DR 200 01 (fcm).jpg](https://commons.wikimedia.org/wiki/File:Trimble_Total_Station_DR_200_01_(fcm).jpg) | Frank C. Müller | CC BY-SA 4.0 | Topografía |
| `img/pavimentacion.jpg` | [File:Asphalt paving.jpg](https://commons.wikimedia.org/wiki/File:Asphalt_paving.jpg) | Stevolala1 | CC BY-SA 4.0 | Pavimentación |
| `img/aguas-lluvias.jpg` | [File:Storm drain pipe.JPG](https://commons.wikimedia.org/wiki/File:Storm_drain_pipe.JPG) | Anonimski | CC0 | Aguas lluvias |

Si el sitio se publica con estas imágenes, las licencias CC BY-SA exigen atribución visible. Lo recomendable es reemplazarlas por fotografías propias.

## Comprobaciones realizadas

Con Chrome headless (Playwright) a 1440×900 y 390×844, en ambas propuestas:

- Sin desbordamiento horizontal en escritorio ni móvil.
- Sin errores de consola ni recursos fallidos. En la 02 aparecen solo avisos de GPU del renderizador por software de la captura headless.
- El menú móvil abre y se cierra al elegir un enlace. El submenú de servicios abre, se cierra con Esc y con clic fuera.
- Los enlaces de cotización llevan a `#contacto`; los de cada servicio preseleccionan ese servicio en el formulario.
- La validación marca los cuatro campos, enfoca el primero inválido y los errores tienen ícono y texto. Con datos válidos se muestra el aviso de demostración.
- El primer Tab llega a «Saltar al contenido».
- Propuesta 02: las pestañas funcionan con clic, flechas y desde el submenú. La escena queda «activa» en escritorio y queda «estatica» con movimiento reducido, sin WebGL, en móvil y al abrir con `file://`.

**Limitaciones:** no se probó en Safari, Firefox ni en dispositivos físicos. La escena 3D se verificó con WebGL por software, no con GPU real. No se hizo una auditoría automática de accesibilidad (axe/Lighthouse); los contrastes de los pares usados salen de la tabla WCAG de la guía.

## Iteración 2 (mejoras puntuales, sin rediseñar)

Cambios aplicados igual en ambas propuestas, salvo donde se indica:

1. **Logo del cliente.** `/logo.png` es en realidad un WebP. `scripts/logo.py` genera en `img/` recortes PNG sin modificar colores ni proporciones:
   - **Encabezado:** versión horizontal con isotipo + nombre (`logo-isotipo.png` + `logo-nombre.png`). La bajada «Ingeniería y consultoría» se omite ahí porque a 40 px de alto mediría unos 7 px y no se leería. *Suposición: validar esta versión horizontal con el cliente.*
   - **Pie:** logo completo apilado (`logo.png`) sobre una superficie blanca de radio 4 px. Sobre el azul de marca, el nombre azul del logo no se leería y no existe una versión en negativo.
   - **Favicon:** el isotipo (`favicon.png`).
   - Se eliminaron los logotipos tipográficos provisionales («SE» y la barra verde).
2. **Aparición suave al desplazar.** Encabezados de sección, columnas, fotografías, pasos y formulario aparecen con una transición de opacidad + 16 px de desplazamiento.
   - **Duración:** 250 ms con ease-out, según el token de movimiento de la guía. Las piezas de un mismo bloque se escalonan 80 ms.
   - **Accesibilidad:** el contenido nunca queda oculto sin JavaScript, con `prefers-reduced-motion: reduce`, sin `IntersectionObserver` ni al imprimir. Si el foco del teclado llega a una pieza todavía oculta, se muestra al instante.
   - **Portada:** no se anima al desplazar; conserva su entrada de carga en la 01 y la escena 3D en la 02.
   - **Pestañas (02):** el bloque de servicios aparece completo, no cada panel, para que un panel oculto por su pestaña no quede invisible al seleccionarlo.
   - **Línea de «Cómo trabajamos» (02):** la línea de perfil se traza desde su origen (horizontal en escritorio, vertical en móvil) y los tres pasos aparecen en orden.
3. **Sección activa en el menú.** Al desplazar, el enlace de la sección visible se subraya con un filete verde de 2 px (`aria-current`).
4. **Encabezado entre 1024 y 1199 px:** el botón «Solicitar cotización» del encabezado se oculta porque no cabe junto al logo y el menú completo. Sigue visible en móvil, en ≥1200 px y en la banda o el cajetín de la portada.

**Comprobaciones de la iteración 2** (Chrome headless a 390, 1024, 1280 y 1440 px):
- Las 19 piezas (01) y 11 piezas (02) quedan visibles tras desplazar hasta el final.
- Sin desbordamiento horizontal, sin errores de consola y con los cuatro recortes del logo cargados.
- Con movimiento reducido y sin JavaScript no hay piezas ocultas.
- El salto a `#contacto` deja el formulario visible y con foco en «Nombre».
- El menú marca «Cómo trabajamos» al llegar a esa sección.

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

## Iteración 3: separación de secciones

Se corrigieron tramos donde dos secciones blancas quedaban seguidas y se mezclaban:

| Sección | Propuesta 01 | Propuesta 02 |
|---|---|---|
| Portada | Blanco + banda azul de cotización | Blanco con retícula |
| Servicios | Blanco; fichas separadas por filetes y pavimentación en niebla | **Niebla**, con el cuadro de pestañas en blanco |
| Cómo trabajamos | **Niebla** | Blanco con retícula |
| Nosotros | Blanco | **Niebla** |
| Contacto | **Niebla** | Blanco |
| Pie | Azul | Azul |

Los efectos se mantienen simples: aparición al desplazar de 250 ms y transiciones de 150 ms.
