/* Sur Eficiencia · desing_v2 · Interacciones comunes de las propuestas 01 y 02.
   Cada módulo se activa solo si su elemento existe en la página. */
(function () {
  'use strict';

  var $ = function (sel, raiz) { return (raiz || document).querySelector(sel); };
  var $$ = function (sel, raiz) { return Array.prototype.slice.call((raiz || document).querySelectorAll(sel)); };
  var menosMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)');
  var conIO = 'IntersectionObserver' in window;

  var anio = $('#anio');
  if (anio) anio.textContent = String(new Date().getFullYear());

  /* ---------- Encabezado: sombra y progreso de lectura ---------- */
  var encabezado = $('#encabezado');
  var progreso = $('#progreso');
  var pendienteScroll = false;
  function alDesplazar() {
    pendienteScroll = false;
    var y = window.scrollY;
    if (encabezado) encabezado.classList.toggle('shadow-[0_1px_12px_rgba(5,50,96,0.08)]', y > 8);
    if (progreso) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progreso.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, y / max) : 0) + ')';
    }
  }
  window.addEventListener('scroll', function () {
    if (!pendienteScroll) { pendienteScroll = true; requestAnimationFrame(alDesplazar); }
  }, { passive: true });
  alDesplazar();

  /* ---------- Menú móvil ---------- */
  var botonMenu = $('#boton-menu');
  var menuMovil = $('#menu-movil');
  var alCambiarMenu = [];
  function abrirMenu(abrir) {
    menuMovil.hidden = !abrir;
    botonMenu.setAttribute('aria-expanded', String(abrir));
    botonMenu.setAttribute('aria-label', abrir ? 'Cerrar menú' : 'Abrir menú');
    $('.icono-abrir', botonMenu).classList.toggle('hidden', abrir);
    $('.icono-cerrar', botonMenu).classList.toggle('hidden', !abrir);
    alCambiarMenu.forEach(function (fn) { fn(); });
  }
  if (botonMenu && menuMovil) {
    botonMenu.addEventListener('click', function () { abrirMenu(menuMovil.hidden); });
    menuMovil.addEventListener('click', function (e) { if (e.target.closest('a')) abrirMenu(false); });
    window.matchMedia('(min-width: 1024px)').addEventListener('change', function (mq) { if (mq.matches) abrirMenu(false); });
  }

  /* ---------- Submenú de servicios (escritorio) ---------- */
  var botonSub = $('[data-submenu]');
  var submenu = $('#submenu-servicios');
  function abrirSub(abrir) {
    submenu.hidden = !abrir;
    botonSub.setAttribute('aria-expanded', String(abrir));
    var chevron = $('svg', botonSub);
    if (chevron) {
      chevron.style.transition = 'transform 150ms ease-out';
      chevron.style.transform = abrir ? 'rotate(180deg)' : '';
    }
  }
  if (botonSub && submenu) {
    botonSub.addEventListener('click', function () { abrirSub(submenu.hidden); });
    submenu.addEventListener('click', function (e) { if (e.target.closest('a')) abrirSub(false); });
    document.addEventListener('click', function (e) {
      if (!submenu.hidden && !e.target.closest('[data-submenu]') && !submenu.contains(e.target)) abrirSub(false);
    });
    submenu.addEventListener('focusout', function (e) {
      if (!submenu.contains(e.relatedTarget) && e.relatedTarget !== botonSub) abrirSub(false);
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (submenu && !submenu.hidden) { abrirSub(false); botonSub.focus(); }
    if (menuMovil && !menuMovil.hidden) { abrirMenu(false); botonMenu.focus(); }
  });

  /* ---------- Acordeón de servicios (propuesta 02) ----------
     Sin JavaScript todas las filas quedan abiertas. Con JS se abre solo la primera. */
  var filas = $$('[data-acordeon]');
  function abrirFila(boton, abrir) {
    boton.setAttribute('aria-expanded', String(abrir));
    var cuerpo = document.getElementById(boton.getAttribute('aria-controls'));
    if (cuerpo) cuerpo.setAttribute('data-abierto', String(abrir));
  }
  if (filas.length) {
    filas.forEach(function (boton, i) {
      abrirFila(boton, i === 0);
      boton.addEventListener('click', function () {
        abrirFila(boton, boton.getAttribute('aria-expanded') !== 'true');
      });
    });
    document.documentElement.classList.add('acordeon-activo');
  }
  // Abre la fila de un servicio cuando se llega por un enlace (menú, índice, pie) o por la URL.
  function abrirServicioDesdeHash(hash) {
    var objetivo = hash && document.getElementById(hash.slice(1));
    var boton = objetivo && $('[data-acordeon]', objetivo);
    if (boton) abrirFila(boton, true);
  }
  if (filas.length) {
    $$('a[href^="#servicio-"]').forEach(function (a) {
      a.addEventListener('click', function () { abrirServicioDesdeHash(a.getAttribute('href')); });
    });
    abrirServicioDesdeHash(location.hash);
  }

  /* ---------- Enlaces de cotización: preseleccionan el servicio y enfocan el formulario ---------- */
  var selectServicio = $('#servicio');
  $$('[data-cotizar]').forEach(function (enlace) {
    enlace.addEventListener('click', function () {
      var servicio = enlace.getAttribute('data-servicio');
      if (servicio && selectServicio) {
        selectServicio.value = servicio;
        limpiarError(selectServicio);
      }
      window.setTimeout(function () {
        var nombre = $('#nombre');
        if (nombre) nombre.focus({ preventScroll: true });
      }, 450);
    });
  });

  /* ---------- Aparición al desplazar ---------- */
  (function () {
    var piezas = $$('[data-revelar]');
    if (!piezas.length || menosMovimiento.matches || !conIO) return;
    var revelar = function (el) { el.classList.add('revelado'); };
    var observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) { revelar(entrada.target); observador.unobserve(entrada.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0 });
    document.documentElement.classList.add('revelar-activo');
    piezas.forEach(function (el) { observador.observe(el); });
    // El foco del teclado nunca cae en una pieza invisible.
    document.addEventListener('focusin', function (e) {
      var pieza = e.target.closest && e.target.closest('[data-revelar]:not(.revelado)');
      if (pieza) { pieza.style.transitionDelay = '0ms'; revelar(pieza); }
    });
  })();

  /* ---------- Sección activa en el menú principal ---------- */
  (function () {
    if (!conIO) return;
    var enlaces = {};
    $$('nav[aria-label="Principal"] .nav-link').forEach(function (el) {
      var id = el.getAttribute('data-seccion') || (el.getAttribute('href') || '').slice(1);
      if (id) enlaces[id] = el;
    });
    var marcar = function (id) {
      Object.keys(enlaces).forEach(function (clave) {
        if (clave === id) enlaces[clave].setAttribute('aria-current', 'true');
        else enlaces[clave].removeAttribute('aria-current');
      });
    };
    var espia = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) { if (entrada.isIntersecting) marcar(entrada.target.id); });
    }, { rootMargin: '-45% 0px -54% 0px', threshold: 0 });
    Object.keys(enlaces).forEach(function (id) {
      var seccion = document.getElementById(id);
      if (seccion) espia.observe(seccion);
    });
  })();

  /* ---------- Índice de servicios activo (propuesta 01: lateral y fila móvil) ---------- */
  (function () {
    var marcas = $$('[data-indice]');
    if (!marcas.length || !conIO) return;
    var chips = $('#chips-servicios');
    var marcar = function (id) {
      marcas.forEach(function (el) {
        var activo = el.getAttribute('data-indice') === id;
        if (activo) el.setAttribute('aria-current', 'true'); else el.removeAttribute('aria-current');
        // Mantiene visible el chip activo dentro de la fila deslizable.
        if (activo && chips && chips.contains(el) && chips.offsetParent !== null) {
          var izquierda = el.offsetLeft - (chips.clientWidth - el.offsetWidth) / 2;
          chips.scrollTo({ left: izquierda, behavior: menosMovimiento.matches ? 'auto' : 'smooth' });
        }
      });
    };
    var vistos = {};
    marcas.forEach(function (el) { vistos[el.getAttribute('data-indice')] = true; });
    var espia = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) { if (entrada.isIntersecting) marcar(entrada.target.id); });
    }, { rootMargin: '-35% 0px -60% 0px', threshold: 0 });
    Object.keys(vistos).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) espia.observe(el);
    });
  })();

  /* ---------- Barra de cotización en móvil ---------- */
  (function () {
    var barra = $('#barra-cotizar');
    if (!barra || !conIO) return;
    var estado = { inicio: true, contacto: false, pie: false };
    var actualizar = function () {
      var menuAbierto = menuMovil && !menuMovil.hidden;
      barra.setAttribute('data-visible', String(!estado.inicio && !estado.contacto && !estado.pie && !menuAbierto));
    };
    var observar = function (el, clave, margen, soloArriba) {
      if (!el) return;
      new IntersectionObserver(function (entradas) {
        var e = entradas[0];
        // soloArriba: el elemento cuenta como «fuera» únicamente cuando ya quedó por encima de la vista.
        estado[clave] = soloArriba ? (e.isIntersecting || e.boundingClientRect.top > 0) : e.isIntersecting;
        actualizar();
      }, { rootMargin: margen || '0px' }).observe(el);
    };
    // La barra aparece justo cuando el botón de cotizar de la portada sale por arriba (bajo el encabezado fijo).
    var ctaPortada = $('#inicio [data-cotizar]') || $('#inicio');
    var pendienteBarra = false;
    var revisarPortada = function () {
      pendienteBarra = false;
      estado.inicio = ctaPortada ? ctaPortada.getBoundingClientRect().bottom > 72 : false;
      actualizar();
    };
    window.addEventListener('scroll', function () {
      if (!pendienteBarra) { pendienteBarra = true; requestAnimationFrame(revisarPortada); }
    }, { passive: true });
    window.addEventListener('resize', revisarPortada);
    revisarPortada();
    observar($('#contacto'), 'contacto');
    observar($('footer'), 'pie');
    alCambiarMenu.push(actualizar);
  })();

  /* ---------- WhatsApp: se activa solo con un número configurado ----------
     El número vive en sitio.config.json; «npm run dist» lo escribe en <meta name="sur-whatsapp">.
     Sin número, ningún elemento [data-whatsapp] se muestra: no se publica un enlace ficticio. */
  (function () {
    var meta = document.querySelector('meta[name="sur-whatsapp"]');
    var numero = meta ? (meta.getAttribute('content') || '').replace(/\D/g, '') : '';
    var piezas = Array.prototype.slice.call(document.querySelectorAll('[data-whatsapp]'));
    if (numero.length < 8 || !piezas.length) return;
    var mensaje = meta.getAttribute('data-mensaje') || '';
    var url = 'https://wa.me/' + numero + (mensaje ? '?text=' + encodeURIComponent(mensaje) : '');
    piezas.forEach(function (el) {
      if (el.tagName === 'A') el.setAttribute('href', url);
      el.hidden = false;
    });

    var flotante = document.querySelector('.wsp-flotante');
    if (!flotante || !('IntersectionObserver' in window)) return;
    var menu = document.getElementById('menu-movil');
    var estado = { inicio: true, contacto: false, pie: false };
    var actualizar = function () {
      var menuAbierto = menu && !menu.hidden;
      flotante.setAttribute('data-visible', String(!estado.inicio && !estado.contacto && !estado.pie && !menuAbierto));
    };
    var observar = function (el, clave, margen, soloArriba) {
      if (!el) return;
      new IntersectionObserver(function (entradas) {
        var e = entradas[0];
        estado[clave] = soloArriba ? (e.isIntersecting || e.boundingClientRect.top > 0) : e.isIntersecting;
        actualizar();
      }, { rootMargin: margen || '0px' }).observe(el);
    };
    document.documentElement.classList.add('wsp-activo');
    // Aparece cuando el botón de cotizar de la portada ya quedó por encima de la vista (bajo el encabezado);
    // se calcula con la posición real para que funcione desde cualquier punto de partida.
    var ctaPortada = document.querySelector('#inicio [data-cotizar]') || document.getElementById('inicio');
    var pendienteWsp = false;
    var revisarPortada = function () {
      pendienteWsp = false;
      estado.inicio = ctaPortada ? ctaPortada.getBoundingClientRect().bottom > 72 : false;
      actualizar();
    };
    window.addEventListener('scroll', function () {
      if (!pendienteWsp) { pendienteWsp = true; requestAnimationFrame(revisarPortada); }
    }, { passive: true });
    window.addEventListener('resize', revisarPortada);
    revisarPortada();
    observar(document.getElementById('contacto'), 'contacto');
    observar(document.querySelector('footer'), 'pie');
    var botonMenuWsp = document.getElementById('boton-menu');
    if (botonMenuWsp) botonMenuWsp.addEventListener('click', function () { window.setTimeout(actualizar, 0); });
    if (menu) menu.addEventListener('click', function () { window.setTimeout(actualizar, 0); });
    actualizar();
  })();

  /* ---------- Validación del formulario ---------- */
  var form = $('#formulario');
  var estadoForm = $('#estado-formulario');
  var correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var reglas = {
    nombre: function (v) { return v.trim().length >= 2; },
    correo: function (v) { return correoValido.test(v.trim()); },
    servicio: function (v) { return v !== ''; },
    mensaje: function (v) { return v.trim().length >= 10; }
  };
  function marcarError(campo) {
    campo.setAttribute('aria-invalid', 'true');
    document.getElementById('error-' + campo.name).hidden = false;
  }
  function limpiarError(campo) {
    campo.removeAttribute('aria-invalid');
    var err = document.getElementById('error-' + campo.name);
    if (err) err.hidden = true;
  }
  function validar(campo) {
    var ok = reglas[campo.name](campo.value);
    if (ok) limpiarError(campo); else marcarError(campo);
    return ok;
  }
  if (form) {
    Object.keys(reglas).forEach(function (nombre) {
      var campo = form.elements[nombre];
      campo.addEventListener('blur', function () { if (campo.value) validar(campo); });
      campo.addEventListener('input', function () { if (campo.getAttribute('aria-invalid')) validar(campo); });
      campo.addEventListener('change', function () { if (campo.getAttribute('aria-invalid')) validar(campo); });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      estadoForm.innerHTML = '';
      var primerInvalido = null;
      Object.keys(reglas).forEach(function (nombre) {
        var campo = form.elements[nombre];
        if (!validar(campo) && !primerInvalido) primerInvalido = campo;
      });
      if (primerInvalido) { primerInvalido.focus(); return; }
      // Sin backend: no se simula un envío exitoso.
      estadoForm.innerHTML =
        '<p class="flex items-start gap-3 rounded border border-azul bg-niebla p-4 text-grafito">' +
        '<span data-icon="info" class="mt-px shrink-0 text-azul"></span>' +
        '<span>Los datos están completos, pero esta es una versión de demostración: la solicitud no se envió.</span></p>';
      if (window.SurIcons) window.SurIcons.render(estadoForm);
    });
  }
})();
