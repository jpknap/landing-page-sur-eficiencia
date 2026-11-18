# landing-page-sur-eficiencia

Propuestas de sitio web para **Sur Eficiencia** (ingeniería y consultoría). Hay dos líneas independientes, cada una con su guía de estilo y dos propuestas:

| Carpeta | Guía | Acento de cotizar | Build listo para subir |
|---|---|---|---|
| `desing_v1/` | `desing_v1/style-guide-summary.md` | Blanco hueso `#F1EBDD` | `desing_v1/output/dist/` · `desing_v1/output/sur-eficiencia-desing-v1.zip` |
| `desing_v2/` | `desing_v2/style-guide-summary.md` | Turquesa `#2BB3C0` | `desing_v2/output/dist/` · `desing_v2/output/sur-eficiencia-desing-v2.zip` |

Cada `dist/` contiene `index.html` (entrada), `propuesta-01/` (editorial y fotográfica) y `propuesta-02/` (arquitectónica con visualización 3D).

## Publicar

1. Suba el **contenido** de `dist/` (o descomprima el `.zip`) en la carpeta pública del hosting. Es HTML estático con rutas relativas.
2. Antes de la publicación definitiva, en `output/sitio.config.json`:
   - reemplace el número de WhatsApp de **prueba** (+56 9 0000 0000) por el real en `whatsapp` (vacío = el botón no aparece);
   - cambie `indexar` a `true` para quitar el bloqueo a buscadores;
   - regenere con `npm install` (la primera vez) y `npm run dist` dentro de `output/`.

Los detalles de diseño, las suposiciones y el contenido pendiente están en el `README.md` de cada `output/`.
