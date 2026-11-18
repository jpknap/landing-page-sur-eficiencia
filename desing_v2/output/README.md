# Sur Eficiencia: propuestas web (desing_v2)

Dos propuestas construidas **solo** con los documentos de `desing_v2/`:

| Carpeta | Brief | Dirección |
|---|---|---|
| `propuesta-01/` | `desing_v2/desing_prompt_v1.md` | Editorial y fotográfica, sin 3D |
| `propuesta-02/` | `desing_v2/desing_prompt_v2.md` | Arquitectónica y técnica, con una escena Three.js en la portada |

**Guía aplicada:** `desing_v2/style-guide-summary.md` (v0.2). Su diferencia con la de v1 es el acento: **Turquesa Cotizar `#2BB3C0`**, reservado a la acción de cotizar, con texto Azul Sur `#053260` encima (5,09:1). El blanco hueso de la v1 no aparece en ningún archivo de esta carpeta.

Los prompts de `desing_v2` todavía mencionan el «blanco hueso». Como indican que la guía es la fuente de verdad para los colores, se aplicó el turquesa con la función que la guía le asigna.

Se parte de la estructura ya validada en `desing_v1/output` (iteración 2 incluida). Cada propuesta suma cambios propios de experiencia de usuario, así que ya no son iguales a las de v1.

## Cómo abrirlas

```bash
cd desing_v2/output
npm run serve        # http://localhost:4173/propuesta-01/  y  /propuesta-02/
# opcional, para recompilar:
npm install && npm run build
npm run logo         # recortes del logo desde /logo.png (requiere Pillow)
```

- **Propuesta 01** también se puede abrir con doble clic en `index.html`.
- **Propuesta 02** necesita `npm run serve` para la escena 3D. Si se abre con doble clic, muestra la alternativa estática y el resto funciona igual.

Stack: HTML estático + Tailwind CSS 3.4 + íconos Lucide 0.460 (solo los usados) + Three.js 0.170 (solo en la 02).

## Uso del turquesa

- **Todas las acciones «Solicitar cotización»** usan el turquesa: encabezado, portada, cada servicio, cajetín, barra móvil, pie y el botón «Enviar solicitud». A diferencia de la v1, la guía no limita el acento a fondos azules, así que también va sobre blanco y niebla.
- Para que el color mantenga su función, **ningún otro elemento** usa turquesa. Íconos, foco y detalles sobre azul van en blanco. El modelo 3D tampoco lo usa.
- **Hover:** el botón se subraya en lugar de cambiar de color, para no salir de la paleta.
- **Contraste:** el par de texto azul sobre turquesa da 5,09:1 (AA). El borde del botón contra el blanco queda en torno a 2,4:1, pero el botón se identifica por su texto azul. Si se quiere reforzar, se le puede agregar un filete azul de 1 px.

## Cambios propios de esta versión

### Propuesta 01: editorial y fotográfica
- **Portada sobre Azul Sur** («fondos institucionales» en la guía), con titular blanco, la fotografía a sangre a la derecha y «Solicitar cotización» en turquesa dentro de la misma portada. Desaparece la banda separada de la v1. **Efecto en la experiencia:** en móvil la acción principal queda en el primer pantallazo, antes de la foto; en la v1 quedaba después de la imagen.
- El resto conserva la composición editorial: índice de servicios con filetes, una composición por servicio, pasos, nosotros y formulario.

### Propuesta 02: arquitectónica y técnica
- **Pestañas de servicios en todos los tamaños.** En móvil la lista de servicios queda arriba y se ve un servicio a la vez, en lugar de cinco paneles largos apilados. Si el panel elegido queda fuera de la vista, la página se acerca suavemente (o al instante con movimiento reducido). Los enlaces de servicios del menú móvil abren su pestaña. Sin JavaScript se oculta la lista y se leen los cinco paneles.
- **«Cómo trabajamos» como banda Azul Sur** con retícula clara, nodos y línea de perfil en blanco. La línea se traza al aparecer.
- Se quitaron los íconos repetidos en los títulos de los paneles, porque la pestaña ya los muestra.

### Ambas
- **Barra fija de cotización en móvil** (<768 px). Aparece cuando la portada sale de la vista y se oculta al llegar al formulario, en el pie y con el menú abierto. Respeta el área segura de iPhone (`viewport-fit=cover`) y el formulario no queda tapado (`scroll-padding-bottom`). Al usarla, lleva a `#contacto` y pone el foco en «Nombre».
- Se mantiene lo de la iteración 2 de v1:
  - Logo del cliente: horizontal en el encabezado, completo sobre superficie blanca en el pie, isotipo como favicon.
  - Aparición suave al desplazar, 250 ms, que nunca oculta contenido sin JS ni con movimiento reducido.
  - Sección activa marcada en el menú.
  - Validación accesible del formulario.
  - Escena 3D con alternativa estática.

## Suposiciones

1. **Trato:** se usa «usted» (`voice.address` está pendiente).
2. **Logo:** la versión horizontal del encabezado (isotipo + nombre, sin bajada) es una derivación del logo apilado. Debe validarla el cliente.
3. **Prestaciones:** solo las de `estructura navegacion.md`. «Nosotros» no menciona formación profesional porque no hay datos.
4. **Formulario:** no hay backend. La página avisa que es una demostración y no simula un envío exitoso.
5. **«Cómo trabajamos»** (consulta inicial → revisión del requerimiento → propuesta técnica): **es contenido propuesto y debe validarse.**
6. **Menú:** Inicio, Servicios (con los cinco servicios), Cómo trabajamos, Nosotros y Contacto.
7. **Encabezado entre 1024 y 1199 px:** el botón de cotizar del encabezado se oculta porque no cabe. La acción sigue en la portada.

## Contenido por validar con el cliente

- Problema, propuesta de valor, prueba y cobertura territorial: se omitieron.
- **WhatsApp y correo:** no hay datos verificados, así que no hay enlaces. La guía pide «WhatsApp siempre a mano».
- Trato usted/tú, formación profesional, fotografías reales (`imagery.source`), logo en SVG y aprobaciones (`decisions[0..1].approved_by`).

## Imágenes referenciales (Wikimedia Commons)

Llevan la leyenda visible «Imagen referencial», sin filtros. No representan trabajos de Sur Eficiencia.

| Archivo | Original | Autor | Licencia |
|---|---|---|---|
| `img/vivienda.jpg` | [File:Casa K1.JPG](https://commons.wikimedia.org/wiki/File:Casa_K1.JPG) | Ccaba77 (Christian Caba) | CC BY-SA 3.0 |
| `img/topografia.jpg` | [File:Trimble Total Station DR 200 01 (fcm).jpg](https://commons.wikimedia.org/wiki/File:Trimble_Total_Station_DR_200_01_(fcm).jpg) | Frank C. Müller | CC BY-SA 4.0 |
| `img/pavimentacion.jpg` | [File:Asphalt paving.jpg](https://commons.wikimedia.org/wiki/File:Asphalt_paving.jpg) | Stevolala1 | CC BY-SA 4.0 |
| `img/aguas-lluvias.jpg` | [File:Storm drain pipe.JPG](https://commons.wikimedia.org/wiki/File:Storm_drain_pipe.JPG) | Anonimski | CC0 |

Las licencias CC BY-SA exigen atribución si se publica. Lo recomendable es reemplazarlas por fotos propias.

## Comprobaciones realizadas

Chrome headless (Playwright) a 390, 1024, 1280 y 1440 px:

- Sin desbordamiento horizontal, sin errores de consola, logos cargados y botones de cotizar en `rgb(43, 179, 192)`.
- Todas las piezas con aparición quedan visibles tras desplazar. Con movimiento reducido y sin JavaScript no hay piezas ocultas.
- **Barra móvil:** oculta en la portada, en el formulario y con el menú abierto; visible en Servicios y en Cómo trabajamos. Al usarla, va a `#contacto` con foco en «Nombre».
- **Menús:** el menú móvil se cierra al elegir un enlace y el submenú de escritorio se cierra con Esc.
- **Formulario:** los botones de cotizar preseleccionan el servicio. La validación muestra los cuatro errores y enfoca el primero. Con datos válidos aparece el aviso de demostración.
- **Propuesta 02:**
  - Pestañas con flechas en escritorio; en móvil, al tocar «Subdivisión» queda visible solo ese panel y la página lo acerca; el menú móvil abre la pestaña correcta.
  - Escena 3D «activa» en escritorio y «estatica» con movimiento reducido.
  - Sin JS, la lista de pestañas se oculta y se ven los cinco paneles.

**Limitaciones:** no se probó en Safari, Firefox ni en dispositivos físicos. El 3D se verificó con WebGL por software. No se hizo una auditoría automática de accesibilidad.
