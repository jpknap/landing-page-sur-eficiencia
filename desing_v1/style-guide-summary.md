# Guía de estilo — Sur Eficiencia

_Ingeniería y consultoría_

Versión 0.2 · 2026-11-03 · Borrador. Resumen generado desde la fuente; no se edita a mano.

## Esencia

- **Qué hacemos:** Ingeniería, asesoría técnica y desarrollo de proyectos: diagnóstico térmico, topografía, pavimentación y aguas lluvias, subdivisión, y agua potable y alcantarillado.
- **Para quién:** Clientes particulares, empresas y organizaciones que requieren servicios técnicos.
- **Problema:** _Pendiente_
- **Propuesta de valor:** _Pendiente_
- **Prueba:** _Pendiente_
- **Acción principal:** Solicitar cotización

| Somos | Pero no | Se ve en |
|---|---|---|
| Profesionales | Herméticos | Términos técnicos definidos; mediciones con cifras tabulares |
| Modernos | Llamativos | Azul y verde sobre blanco; un acento blanco hueso |
| Cercanos | Informales | Lenguaje llano; WhatsApp siempre a mano |

## Voz

Trato de _pendiente_, profesional cercano, en nosotros (Español de Chile).

| Sí | No |
|---|---|
| La termografía es una cámara que muestra por dónde se escapa el calor de la vivienda. | Inspección termográfica de envolvente con análisis de puentes térmicos. |
| Solicitar cotización | Más información |
| El informe indica dónde se pierde calor y qué mejoras se recomiendan. | Ahorro garantizado de hasta 40 % en calefacción. |

## Color

| Rol | Nombre | HEX | Uso | Por qué se eligió |
|---|---|---|---|---|
| Primario | Azul Sur | `#053260` | Titulares, fondos institucionales y firma | Es el azul del logo: llevarlo a cada punto de contacto construye reconocimiento con una paleta corta y constante. (Wheeler y Meyerson, 2024) |
| Secundario | Verde Sur | `#3A753E` | Detalles: filetes, íconos y bordes | Es el verde del logo y conserva su función de detalle, como en los filetes de la firma: un color con un papel fijo en el sistema. (Kholmatova, 2017) |
| Acento | Blanco hueso | `#F1EBDD` | Solo la acción de cotizar, sobre fondos azules | Un blanco cálido y sobrio en lugar de un tono saturado: sobre el azul de marca distingue la acción de cotizar sin sumar un color llamativo. (Kholmatova, 2017) |
| Texto sobre primario | Blanco sobre azul | `#FFFFFF` | Texto sobre fondos azules | Par de fondo y texto fijado una vez como token, para que toda pieza sobre azul use siempre la misma combinación. (Kholmatova, 2017) |
| Texto sobre acento | Azul sobre hueso | `#053260` | Texto sobre el blanco hueso | Repite el azul de marca sobre el blanco hueso: la acción suma contraste sin agregar un color a la paleta. (Wheeler y Meyerson, 2024) |
| Texto principal | Grafito | `#1B2733` | Texto corrido | Un único color de lectura, nombrado por su función, para que todas las piezas usen el mismo tono de texto. (Kholmatova, 2017) |
| Texto secundario | Gris pizarra | `#55616C` | Pies de foto y textos secundarios | Segundo nivel de texto para pies de termogramas y datos de apoyo: jerarquía sin sumar un color de marca. (Kholmatova, 2017) |
| Fondo | Blanco | `#FFFFFF` | Superficies de lectura | El blanco que pide el cliente: fondo neutro que deja al azul y al verde el trabajo de identificar la marca. (Wheeler y Meyerson, 2024) |
| Fondo alterno | Niebla | `#EEF3F6` | Fondo secundario para separar bloques | Fondo alterno con una función fija: separar bloques de contenido sin sumar otro color. (Kholmatova, 2017) |
| Éxito | Verde confirmación | `#1E7A3C` | Confirmaciones | Color de estado con significado fijo, siempre junto a ícono y texto; nunca se usa como decoración. (Kholmatova, 2017) |
| Error | Rojo error | `#B3261E` | Avisos de error | Reservado a errores con el mismo criterio que el verde de estado: significado fijo, siempre con ícono y texto. (Kholmatova, 2017) |

## Tipografía

| Rol | Familia | Pesos | Licencia | Por qué se eligió |
|---|---|---|---|---|
| Títulos | Manrope | 500 · 600 · 700 | SIL Open Font License | Sans serif de formas abiertas y trazo sobrio para títulos; con Source Sans 3 forma un sistema de solo dos familias, siempre las mismas. (Wheeler y Meyerson, 2024) |
| Texto | Source Sans 3 | 400 · 600 | SIL Open Font License | Sans serif legible en tamaños pequeños, con español completo y cifras tabulares para mediciones; fija en el texto corrido. (Wheeler y Meyerson, 2024) |

Escala: base 16 px, razón 1,2 en móvil y 1,25 en escritorio; interlineado 1,5; unos 66 caracteres por línea. Monoespaciada: Source Code Pro.

## Contraste (WCAG 2.2 AA)

| Par | Contraste | Mínimo | Cumple |
|---|---|---|---|
| Texto sobre fondo | 15,17:1 | 4,5:1 | Sí |
| Texto secundario sobre fondo | 6,34:1 | 4,5:1 | Sí |
| Texto sobre fondo alterno | 13,57:1 | 4,5:1 | Sí |
| Texto sobre color primario (botón principal) | 12,87:1 | 4,5:1 | Sí |
| Texto sobre color de acento (CTA) | 10,83:1 | 4,5:1 | Sí |
| Mensaje de error sobre fondo | 6,54:1 | 4,5:1 | Sí |
| Mensaje de éxito sobre fondo | 5,38:1 | 4,5:1 | Sí |

## Sistema

- **Espaciado:** base 8 px; escala 4, 8, 12, 16, 24, 32, 48, 64, 96 px; contenedor máximo 1200 px.
- **Íconos:** Lucide, estilo line, trazo 2 px.
- **Imágenes:** Trabajos reales: terreno, viviendas, equipos de medición, planos e infraestructura. Evitar: Banco de imágenes como trabajo propio, Termogramas de fondo decorativo, Filtros o capas de color.
- **Superficies:** radio 4 px; borde Filete de 1 px; en verde de marca cuando separa o destaca..
- **Movimiento:** 150, 250 ms, ease-out.

## Pendientes

- `essence.problem`
- `essence.value_proposition`
- `essence.proof`
- `essence.coverage`
- `voice.address`
- `imagery.source`
- `decisions[0].approved_by`
- `decisions[1].approved_by`

## Referencias

- Kholmatova (2017). _Design Systems: A Practical Guide to Creating Design Languages for Digital Products_.
- Wheeler y Meyerson (2024). _Designing Brand Identity: A Comprehensive Guide to the World of Brands and Branding_.
