/* Propuesta 02 · Escena 3D de la portada: volumetría conceptual (terreno, lotes, vía, viviendas).
   - Se carga como módulo diferido: no bloquea el contenido.
   - Alternativa estática (SVG con la misma composición) en móvil, con movimiento reducido,
     mientras carga o si WebGL falla.
   - Render bajo demanda: solo dibuja cuando el puntero mueve la escena; se detiene fuera de
     pantalla o con la pestaña oculta. Libera recursos al salir de la página. */

const contenedor = document.getElementById('escena');

const esMovil = window.matchMedia('(max-width: 767px), (pointer: coarse)').matches;
const reduceMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function webglDisponible() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch (e) {
    return false;
  }
}

if (contenedor && !esMovil && !reduceMovimiento && webglDisponible()) {
  // Espera a que el navegador esté libre para no competir con el contenido principal.
  const iniciar = () => import('../vendor/three.module.min.js').then(montar).catch(() => {
    contenedor.dataset.estado = 'estatica';
  });
  if ('requestIdleCallback' in window) requestIdleCallback(iniciar, { timeout: 1500 });
  else setTimeout(iniciar, 300);
}

function montar(THREE) {
  const COLORES = {
    azul: 0x053260,
    verde: 0x3a753e,
    niebla: 0xeef3f6,
    blanco: 0xffffff,
    pizarra: 0x55616c,
  };

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  } catch (e) {
    contenedor.dataset.estado = 'estatica';
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.setAttribute('aria-hidden', 'true');
  contenedor.appendChild(renderer.domElement);

  const escena = new THREE.Scene();

  // Cámara ortográfica isométrica: la misma vista que la alternativa estática.
  const camara = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
  const DIST = 20;
  const objetivo = new THREE.Vector3(0, 0.4, 0);
  const angBase = { az: Math.PI / 4, el: Math.atan(1 / Math.SQRT2) };

  // Luces sobrias
  escena.add(new THREE.HemisphereLight(COLORES.blanco, COLORES.niebla, 2.4));
  const sol = new THREE.DirectionalLight(COLORES.blanco, 1.2);
  sol.position.set(6, 12, 4);
  sol.castShadow = true;
  sol.shadow.mapSize.set(1024, 1024);
  Object.assign(sol.shadow.camera, { left: -9, right: 9, top: 9, bottom: -9, near: 1, far: 30 });
  sol.shadow.radius = 4;
  sol.shadow.bias = -0.0008;
  escena.add(sol);

  const grupo = new THREE.Group();
  escena.add(grupo);

  const recursos = [];
  const reg = (o) => (recursos.push(o), o);
  const matLinea = (color, opts = {}) => reg(new THREE.LineBasicMaterial({ color, ...opts }));
  const matSolido = (color) => reg(new THREE.MeshStandardMaterial({ color, roughness: 0.9, metalness: 0 }));

  const mNiebla = matSolido(COLORES.niebla);
  const mBlanco = matSolido(COLORES.blanco);
  const mAzul = matSolido(COLORES.azul);
  const mPizarra = matSolido(COLORES.pizarra);
  const lAzul = matLinea(COLORES.azul);
  const lVerde = matLinea(COLORES.verde);
  const lBlanco = matLinea(COLORES.blanco); // aristas de techos: se leen sobre el fondo azul de la portada

  function conAristas(geo, mat, lineMat = lAzul) {
    reg(geo);
    const malla = new THREE.Mesh(geo, mat);
    malla.castShadow = true;
    malla.receiveShadow = true;
    const aristas = new THREE.LineSegments(reg(new THREE.EdgesGeometry(geo, 20)), lineMat);
    malla.add(aristas);
    return malla;
  }

  // Placa de terreno 12 × 8
  const placa = conAristas(new THREE.BoxGeometry(12, 0.3, 8), mNiebla);
  placa.position.y = -0.15;
  grupo.add(placa);

  // Vía
  const via = new THREE.Mesh(reg(new THREE.BoxGeometry(12, 0.04, 1.6)), mPizarra);
  via.position.set(0, 0.02, 3);
  via.receiveShadow = true;
  grupo.add(via);

  function polilinea(puntos, mat, discontinua = false) {
    const geo = reg(new THREE.BufferGeometry().setFromPoints(puntos.map((p) => new THREE.Vector3(...p))));
    const l = new THREE.Line(geo, mat);
    if (discontinua) l.computeLineDistances();
    grupo.add(l);
    return l;
  }
  const lDiscBlanco = reg(new THREE.LineDashedMaterial({ color: COLORES.blanco, dashSize: 0.35, gapSize: 0.35 }));
  const lDiscAzul = reg(new THREE.LineDashedMaterial({ color: COLORES.azul, dashSize: 0.1, gapSize: 0.2 }));
  const lDiscVerde = reg(new THREE.LineDashedMaterial({ color: COLORES.verde, dashSize: 0.15, gapSize: 0.2 }));

  polilinea([[-6, 0.05, 3], [6, 0.05, 3]], lDiscBlanco, true);
  polilinea([[-6, 0.02, 1.9], [6, 0.02, 1.9]], lDiscAzul, true); // red sanitaria
  // Deslindes de lotes
  const y = 0.02;
  polilinea([[-6, y, 1.6], [6, y, 1.6]], lVerde);
  polilinea([[-2, y, -4], [-2, y, 1.6]], lVerde);
  polilinea([[2, y, -4], [2, y, 1.6]], lVerde);

  // Viviendas: cuerpo + techo a dos aguas
  function vivienda(cx, cz, w, d, h, rh) {
    const v = new THREE.Group();
    const cuerpo = conAristas(new THREE.BoxGeometry(w, h, d), mBlanco);
    cuerpo.position.y = h / 2;
    v.add(cuerpo);
    const forma = new THREE.Shape();
    forma.moveTo(-d / 2, 0);
    forma.lineTo(d / 2, 0);
    forma.lineTo(0, rh);
    forma.closePath();
    const geoTecho = new THREE.ExtrudeGeometry(forma, { depth: w, bevelEnabled: false });
    geoTecho.rotateY(Math.PI / 2);
    geoTecho.translate(-w / 2, h, 0);
    const techo = conAristas(geoTecho, mAzul, lBlanco);
    v.add(techo);
    v.position.set(cx, 0, cz);
    grupo.add(v);
  }
  vivienda(-4, -1.2, 2.2, 1.6, 1.4, 0.9);
  vivienda(0, -1.4, 2.6, 1.8, 1.7, 1.0);

  // Lote 3: polígono de medición con estacas
  const estaca = reg(new THREE.CylinderGeometry(0.04, 0.04, 0.6, 8));
  const mVerde = matSolido(COLORES.verde);
  [[2.8, -3.2], [5.2, -3.2], [5.2, 0.8], [2.8, 0.8]].forEach(([x, z]) => {
    const e = new THREE.Mesh(estaca, mVerde);
    e.position.set(x, 0.3, z);
    e.castShadow = true;
    grupo.add(e);
  });
  polilinea([[2.8, y, -3.2], [5.2, y, -3.2], [5.2, y, 0.8], [2.8, y, 0.8], [2.8, y, -3.2]], lDiscVerde, true);

  // ---------- Tamaño y cámara ----------
  let ancho = 0;
  let alto = 0;
  function ajustar() {
    const r = contenedor.getBoundingClientRect();
    ancho = Math.max(1, r.width);
    alto = Math.max(1, r.height);
    renderer.setSize(ancho, alto, false);
    const aspecto = ancho / alto;
    const mitadAlto = 5.4; // encuadre fijo en unidades de escena
    camara.left = -mitadAlto * aspecto;
    camara.right = mitadAlto * aspecto;
    camara.top = mitadAlto;
    camara.bottom = -mitadAlto;
    camara.updateProjectionMatrix();
    solicitar();
  }

  // ---------- Respuesta leve al puntero (solo puntero fino) ----------
  const actual = { x: 0, y: 0 };
  const meta = { x: 0, y: 0 };
  const AMPLITUD = { az: 0.07, el: 0.035 }; // radianes: respuesta discreta
  const punteroFino = window.matchMedia('(pointer: fine)').matches;
  if (punteroFino) {
    contenedor.addEventListener('pointermove', (e) => {
      const r = contenedor.getBoundingClientRect();
      meta.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      meta.y = ((e.clientY - r.top) / r.height) * 2 - 1;
      solicitar();
    });
    contenedor.addEventListener('pointerleave', () => {
      meta.x = 0;
      meta.y = 0;
      solicitar();
    });
  }

  function posicionarCamara() {
    const az = angBase.az + actual.x * AMPLITUD.az;
    const el = angBase.el - actual.y * AMPLITUD.el;
    camara.position.set(
      objetivo.x + DIST * Math.cos(el) * Math.sin(az),
      objetivo.y + DIST * Math.sin(el),
      objetivo.z + DIST * Math.cos(el) * Math.cos(az)
    );
    camara.lookAt(objetivo);
  }

  // ---------- Bucle bajo demanda ----------
  let visible = true;
  let pestanaVisible = !document.hidden;
  let pendiente = false;
  let primerCuadro = true;

  function solicitar() {
    if (pendiente || !visible || !pestanaVisible) return;
    pendiente = true;
    requestAnimationFrame(cuadro);
  }

  function cuadro() {
    pendiente = false;
    // Suavizado exponencial hacia la posición objetivo del puntero.
    actual.x += (meta.x - actual.x) * 0.12;
    actual.y += (meta.y - actual.y) * 0.12;
    posicionarCamara();
    renderer.render(escena, camara);
    if (primerCuadro) {
      primerCuadro = false;
      contenedor.dataset.estado = 'activa';
    }
    if (Math.abs(meta.x - actual.x) > 0.001 || Math.abs(meta.y - actual.y) > 0.001) solicitar();
  }

  const io = new IntersectionObserver(([entrada]) => {
    visible = entrada.isIntersecting;
    if (visible) solicitar();
  });
  io.observe(contenedor);

  const alCambiarVisibilidad = () => {
    pestanaVisible = !document.hidden;
    if (pestanaVisible) solicitar();
  };
  document.addEventListener('visibilitychange', alCambiarVisibilidad);

  const ro = new ResizeObserver(ajustar);
  ro.observe(contenedor);

  renderer.domElement.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    contenedor.dataset.estado = 'estatica';
  });

  ajustar();

  // ---------- Liberación de recursos ----------
  function desmontar() {
    io.disconnect();
    ro.disconnect();
    document.removeEventListener('visibilitychange', alCambiarVisibilidad);
    recursos.forEach((r) => r.dispose && r.dispose());
    renderer.dispose();
    renderer.forceContextLoss();
    renderer.domElement.remove();
    contenedor.dataset.estado = 'estatica';
  }
  window.addEventListener('pagehide', desmontar, { once: true });
  window.SurEscena = { desmontar };
}
