// Genera dist/: una copia lista para subir a cualquier servidor estático (Apache, Nginx, Netlify, S3…).
//
//   npm run dist                          usa sitio.config.json
//   npm run dist -- --whatsapp=+56912345678 --out=dist-prueba
//
// Qué hace por cada propuesta:
//   · copia index.html, styles.css, vendor/, los JS (src/ → js/) y solo las imágenes que el HTML usa;
//   · agrega ?v=<hash> a CSS y JS para que el navegador no use versiones antiguas tras actualizar;
//   · escribe el número de WhatsApp (si existe) y muestra sus botones; sin número quedan ocultos;
//   · quita comentarios internos del HTML y, si indexar=false, mantiene noindex y crea robots.txt;
//   · verifica que todas las rutas locales del HTML existan en dist/.
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, existsSync, readdirSync, copyFileSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname, posix } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = Object.fromEntries(process.argv.slice(2).map((a) => {
  const [k, ...v] = a.replace(/^--/, '').split('=');
  return [k, v.join('=')];
}));
const config = JSON.parse(readFileSync(join(raiz, 'sitio.config.json'), 'utf8'));

const whatsapp = String(args.whatsapp ?? config.whatsapp ?? '').trim();
const digitos = whatsapp.replace(/\D/g, '');
if (whatsapp && digitos.length < 8) {
  console.error(`✗ Número de WhatsApp inválido: «${whatsapp}». Use el formato internacional, por ejemplo +56 9 1234 5678.`);
  process.exit(1);
}
const mensaje = String(args.mensaje ?? config.mensajeWhatsapp ?? '');
const NUMERO_PRUEBA = '56900000000';
const esPrueba = digitos === NUMERO_PRUEBA;
const indexar = args.indexar !== undefined ? args.indexar === 'true' : Boolean(config.indexar);
const salida = join(raiz, args.out || 'dist');
const propuestas = readdirSync(raiz).filter((n) => /^propuesta-\d+$/.test(n)).sort();

const hash = (ruta) => createHash('sha256').update(readFileSync(ruta)).digest('hex').slice(0, 10);
const escAttr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const urlWsp = digitos ? `https://wa.me/${digitos}${mensaje ? `?text=${encodeURIComponent(mensaje)}` : ''}` : '';

rmSync(salida, { recursive: true, force: true });
mkdirSync(salida, { recursive: true });

const resumen = [];
for (const prop of propuestas) {
  const origen = join(raiz, prop);
  const destino = join(salida, prop);
  mkdirSync(join(destino, 'js'), { recursive: true });
  mkdirSync(join(destino, 'img'), { recursive: true });

  let html = readFileSync(join(origen, 'index.html'), 'utf8');

  // Vista local: el index.html de origen también refleja el número configurado,
  // para que el botón se vea igual al abrir la propuesta sin pasar por dist/.
  const metaWsp = `<meta name="sur-whatsapp" content="${escAttr(digitos)}" data-mensaje="${escAttr(mensaje)}">`;
  const htmlOrigen = html.replace(/<meta name="sur-whatsapp" content="[^"]*" data-mensaje="[^"]*">/, metaWsp);
  if (htmlOrigen !== html) { writeFileSync(join(origen, 'index.html'), htmlOrigen); html = htmlOrigen; }

  // Estáticos
  copyFileSync(join(origen, 'styles.css'), join(destino, 'styles.css'));
  cpSync(join(origen, 'vendor'), join(destino, 'vendor'), { recursive: true });
  for (const js of readdirSync(join(origen, 'src')).filter((f) => f.endsWith('.js'))) {
    copyFileSync(join(origen, 'src', js), join(destino, 'js', js));
  }
  html = html.replace(/(src|href)="src\//g, '$1="js/');

  // Solo las imágenes que el HTML referencia
  const imagenes = [...new Set([...html.matchAll(/img\/[\w.-]+\.(?:jpg|jpeg|png|webp|svg)/g)].map((m) => m[0]))];
  for (const img of imagenes) copyFileSync(join(origen, img), join(destino, img));

  // WhatsApp
  html = html.replace(/<meta name="sur-whatsapp" content="[^"]*" data-mensaje="[^"]*">/,
    `<meta name="sur-whatsapp" content="${escAttr(digitos)}" data-mensaje="${escAttr(mensaje)}">`);
  if (urlWsp) {
    html = html.replace(/<[a-z]+\b[^>]*\bdata-whatsapp\b[^>]*>/g, (tag) =>
      tag.replace(/\shidden(?=[\s>])/, '').replace('href="#whatsapp"', `href="${escAttr(urlWsp)}"`));
  }

  // Indexación
  if (indexar) html = html.replace(/\s*<meta name="robots" content="noindex">/, '');

  // Comentarios internos fuera y líneas en blanco compactadas
  html = html.replace(/<!--(?!\[if)[\s\S]*?-->/g, '').replace(/\n[ \t]*\n+/g, '\n');

  // Versionado de CSS y JS
  html = html.replace(/(href|src)="((?:styles\.css)|(?:vendor\/[^"?]+)|(?:js\/[^"?]+))"/g,
    (m, attr, ruta) => `${attr}="${ruta}?v=${hash(join(destino, ruta))}"`);

  writeFileSync(join(destino, 'index.html'), html);

  // Verificación de rutas locales
  const rotas = [];
  for (const [, ruta] of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    if (/^(?:https?:|mailto:|tel:|data:|#)/.test(ruta)) continue;
    const limpia = ruta.split(/[?#]/)[0];
    if (limpia && !existsSync(join(destino, limpia))) rotas.push(ruta);
  }
  for (const js of readdirSync(join(destino, 'js'))) {
    const codigo = readFileSync(join(destino, 'js', js), 'utf8');
    for (const [, imp] of codigo.matchAll(/import\(\s*['"](\.[^'"]+)['"]\s*\)/g)) {
      if (!existsSync(join(destino, 'js', imp))) rotas.push(`js/${js} → ${imp}`);
    }
  }
  if (rotas.length) {
    console.error(`✗ ${prop}: rutas sin archivo en dist/: ${rotas.join(', ')}`);
    process.exit(1);
  }

  const peso = (dir) => readdirSync(dir, { withFileTypes: true })
    .reduce((t, e) => t + (e.isDirectory() ? peso(join(dir, e.name)) : statSync(join(dir, e.name)).size), 0);
  resumen.push(`${prop}: ${imagenes.length} imágenes, ${(peso(destino) / 1024 / 1024).toFixed(2)} MB`);
}

// Página de entrada con acceso a cada propuesta
const nombres = config.propuestas || {};
const tarjetas = propuestas.map((p) => `      <li><a href="${p}/"><span>${escAttr(p.replace('propuesta-', 'Propuesta '))}</span><strong>${escAttr(nombres[p] || '')}</strong></a></li>`).join('\n');
const logo = `${propuestas[0]}/img/logo.png`;
writeFileSync(join(salida, 'index.html'), `<!doctype html>
<html lang="es-CL">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Sur Eficiencia, propuestas web</title>
  ${indexar ? '' : '<meta name="robots" content="noindex">'}
  <link rel="icon" type="image/png" href="${propuestas[0]}/img/favicon.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@600;700&family=Source+Sans+3:wght@400&display=swap" rel="stylesheet">
  <style>
    *{box-sizing:border-box}
    body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#EEF3F6;color:#1B2733;font:16px/1.5 "Source Sans 3",system-ui,sans-serif}
    main{width:100%;max-width:640px;padding:48px 16px}
    img{display:block;width:200px;height:auto}
    h1{margin:32px 0 8px;font:700 2rem/1.2 Manrope,system-ui,sans-serif;color:#053260}
    p{margin:0 0 32px;color:#55616C}
    ul{list-style:none;margin:0;padding:0;border-top:1px solid #3A753E}
    li{border-bottom:1px solid rgb(5 50 96 / .15)}
    a{display:flex;flex-direction:column;gap:2px;padding:20px 8px;text-decoration:none;color:#053260;transition:background-color 150ms ease-out}
    a:hover{background:#FFFFFF}
    a:focus-visible{outline:2px solid #053260;outline-offset:2px}
    span{font-size:.875rem;color:#55616C}
    strong{font:600 1.25rem/1.3 Manrope,system-ui,sans-serif}
  </style>
</head>
<body>
  <main>
    <img src="${logo}" width="640" height="390" alt="Sur Eficiencia, ingeniería y consultoría">
    <h1>${escAttr(config.titulo || 'Propuestas de sitio web')}</h1>
    <p>${escAttr(config.bajada || 'Direcciones visuales para revisar. Las imágenes son referenciales.')}</p>
    <ul>
${tarjetas}
    </ul>
  </main>
</body>
</html>
`);
if (!indexar) writeFileSync(join(salida, 'robots.txt'), 'User-agent: *\nDisallow: /\n');

console.log(`✓ dist generado en ${posix.relative(process.cwd().split('\\').join('/'), salida.split('\\').join('/')) || salida}`);
resumen.forEach((l) => console.log('  ' + l));
console.log(`  WhatsApp: ${digitos ? `activo (+${digitos})` : 'sin número: botones ocultos'}`);
if (esPrueba) console.warn('  ⚠ WhatsApp usa el número de PRUEBA +56 9 0000 0000: reemplácelo en sitio.config.json antes de publicar.');
console.log(`  Indexación: ${indexar ? 'permitida' : 'bloqueada (noindex + robots.txt)'}`);
