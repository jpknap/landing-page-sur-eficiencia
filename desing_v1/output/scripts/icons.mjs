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
const js = `/* Íconos Lucide v0.460.0 (ISC). Generado por scripts/icons.mjs */
(function(){var I=${JSON.stringify(out)};
function render(root){(root||document).querySelectorAll('[data-icon]').forEach(function(el){var n=el.getAttribute('data-icon');if(!I[n])return;
var s=el.getAttribute('data-size')||'24';el.outerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="'+s+'" height="'+s+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false" class="'+(el.getAttribute('class')||'')+'">'+I[n]+'</svg>';});}
window.SurIcons={render:render};render();})();
`;
for (const p of ['propuesta-01', 'propuesta-02']) writeFileSync(`${p}/vendor/icons.js`, js);
console.log('icons:', names.length);
