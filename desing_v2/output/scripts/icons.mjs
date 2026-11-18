// Genera vendor/icons.js con solo los íconos Lucide usados (trazo 2 px, estilo line).
import { writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const lucide = createRequire(import.meta.url)('lucide');
const pascal = (n) => n.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join('');
const names = ['menu','x','chevron-down','thermometer','mountain','cloud-rain','land-plot','droplet','circle-alert','info','check','ruler','file-text','message-square'];
const out = {};
for (const n of names) {
  const node = lucide.icons[pascal(n)];
  if (!node) throw new Error('Ícono no encontrado: ' + n);
  const children = Array.isArray(node[2]) ? node[2] : node;
  out[n] = children.map(([tag, attrs]) => `<${tag} ${Object.entries(attrs).map(([k, v]) => `${k}="${v}"`).join(' ')}/>`).join('');
}
// Ícono propio de WhatsApp en estilo línea (burbuja de Lucide «message-circle» + auricular de «phone» reducido),
// para respetar el sistema de íconos de la guía (Lucide, línea, trazo 2 px).
out.whatsapp = '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>' +
  '<path transform="translate(7.1 6.9) scale(0.42)" stroke-width="4" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>';
const js = `/* Íconos Lucide v0.460.0 (ISC). Generado por scripts/icons.mjs */
(function(){var I=${JSON.stringify(out)};
function render(root){(root||document).querySelectorAll('[data-icon]').forEach(function(el){var n=el.getAttribute('data-icon');if(!I[n])return;
var s=el.getAttribute('data-size')||'24';el.outerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="'+s+'" height="'+s+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false" class="'+(el.getAttribute('class')||'')+'">'+I[n]+'</svg>';});}
window.SurIcons={render:render};render();})();
`;
for (const p of ['propuesta-01', 'propuesta-02']) writeFileSync(`${p}/vendor/icons.js`, js);
console.log('icons:', names.length);
