/* Propuesta 01 · Interacciones: menú, submenú, cotización y validación del formulario. */
(function () {
  'use strict';

  var anio = document.getElementById('anio');
  if (anio) anio.textContent = String(new Date().getFullYear());

  /* ---------- Encabezado con sombra al desplazar ---------- */
  var encabezado = document.getElementById('encabezado');
  var alDesplazar = function () {
    encabezado.classList.toggle('shadow-[0_1px_12px_rgba(5,50,96,0.08)]', window.scrollY > 8);
  };
  window.addEventListener('scroll', alDesplazar, { passive: true });
  alDesplazar();

  /* ---------- Menú móvil ---------- */
  var botonMenu = document.getElementById('boton-menu');
  var menuMovil = document.getElementById('menu-movil');

  function abrirMenu(abrir) {
    menuMovil.hidden = !abrir;
    botonMenu.setAttribute('aria-expanded', String(abrir));
    botonMenu.setAttribute('aria-label', abrir ? 'Cerrar menú' : 'Abrir menú');
    botonMenu.querySelector('.icono-abrir').classList.toggle('hidden', abrir);
    botonMenu.querySelector('.icono-cerrar').classList.toggle('hidden', !abrir);
  }
  botonMenu.addEventListener('click', function () { abrirMenu(menuMovil.hidden); });
  menuMovil.addEventListener('click', function (e) {
    if (e.target.closest('a')) abrirMenu(false);
  });
  window.matchMedia('(min-width: 1024px)').addEventListener('change', function (mq) {
    if (mq.matches) abrirMenu(false);
  });

  /* ---------- Submenú de servicios (escritorio) ---------- */
  var botonSub = document.querySelector('[data-submenu]');
  var submenu = document.getElementById('submenu-servicios');

  function abrirSub(abrir) {
    submenu.hidden = !abrir;
    botonSub.setAttribute('aria-expanded', String(abrir));
    var chevron = botonSub.querySelector('svg');
    if (chevron) chevron.style.transform = abrir ? 'rotate(180deg)' : '';
  }
  botonSub.addEventListener('click', function () { abrirSub(submenu.hidden); });
  submenu.addEventListener('click', function (e) { if (e.target.closest('a')) abrirSub(false); });
  document.addEventListener('click', function (e) {
    if (!submenu.hidden && !e.target.closest('[data-submenu]') && !submenu.contains(e.target)) abrirSub(false);
  });
  submenu.addEventListener('focusout', function (e) {
    if (!submenu.contains(e.relatedTarget) && e.relatedTarget !== botonSub) abrirSub(false);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (!submenu.hidden) { abrirSub(false); botonSub.focus(); }
    if (!menuMovil.hidden) { abrirMenu(false); botonMenu.focus(); }
  });

  /* ---------- Enlaces de cotización: llevan al formulario y preseleccionan el servicio ---------- */
  var selectServicio = document.getElementById('servicio');
  document.querySelectorAll('[data-cotizar]').forEach(function (enlace) {
    enlace.addEventListener('click', function () {
      var servicio = enlace.getAttribute('data-servicio');
      if (servicio) {
        selectServicio.value = servicio;
        limpiarError(selectServicio);
      }
      // Lleva el foco al primer campo una vez terminado el desplazamiento.
      window.setTimeout(function () {
        document.getElementById('nombre').focus({ preventScroll: true });
      }, 400);
    });
  });

  /* ---------- Iteración 2: aparición suave al desplazar ---------- */
  (function () {
    var piezas = document.querySelectorAll('[data-revelar]');
    var menosMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!piezas.length || menosMovimiento || !('IntersectionObserver' in window)) return;

    var revelar = function (el) { el.classList.add('revelado'); };
    var observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          revelar(entrada.target);
          observador.unobserve(entrada.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0 });

    document.documentElement.classList.add('revelar-activo');
    piezas.forEach(function (el) { observador.observe(el); });

    // Si el foco del teclado llega a una pieza aún oculta, se muestra de inmediato.
    document.addEventListener('focusin', function (e) {
      var pieza = e.target.closest && e.target.closest('[data-revelar]:not(.revelado)');
      if (pieza) { pieza.style.transitionDelay = '0ms'; revelar(pieza); }
    });
  })();

  /* ---------- Iteración 2: sección activa en el menú ---------- */
  (function () {
    if (!('IntersectionObserver' in window)) return;
    var enlaces = {};
    document.querySelectorAll('nav[aria-label="Principal"] .nav-link').forEach(function (el) {
      var id = el.getAttribute('data-seccion') || (el.getAttribute('href') || '').slice(1);
      if (id) enlaces[id] = el;
    });
    var marcar = function (id) {
      Object.keys(enlaces).forEach(function (clave) {
        if (clave === id) enlaces[clave].setAttribute('aria-current', 'true');
        else enlaces[clave].removeAttribute('aria-current');
      });
    };
    // Una franja horizontal en el centro de la ventana decide qué sección está activa.
    var espia = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) { if (entrada.isIntersecting) marcar(entrada.target.id); });
    }, { rootMargin: '-45% 0px -54% 0px', threshold: 0 });
    Object.keys(enlaces).forEach(function (id) {
      var seccion = document.getElementById(id);
      if (seccion) espia.observe(seccion);
    });
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
  var form = document.getElementById('formulario');
  var estado = document.getElementById('estado-formulario');
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
    document.getElementById('error-' + campo.name).hidden = true;
  }
  function validar(campo) {
    var ok = reglas[campo.name](campo.value);
    if (ok) limpiarError(campo); else marcarError(campo);
    return ok;
  }

  Object.keys(reglas).forEach(function (nombre) {
    var campo = form.elements[nombre];
    campo.addEventListener('blur', function () { if (campo.value) validar(campo); });
    campo.addEventListener('input', function () { if (campo.getAttribute('aria-invalid')) validar(campo); });
    campo.addEventListener('change', function () { if (campo.getAttribute('aria-invalid')) validar(campo); });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    estado.innerHTML = '';
    var primerInvalido = null;
    Object.keys(reglas).forEach(function (nombre) {
      var campo = form.elements[nombre];
      if (!validar(campo) && !primerInvalido) primerInvalido = campo;
    });
    if (primerInvalido) {
      primerInvalido.focus();
      return;
    }
    // Sin backend: no se simula un envío exitoso.
    estado.innerHTML =
      '<p class="flex items-start gap-3 rounded border border-azul bg-niebla p-4 text-grafito">' +
      '<span data-icon="info" class="mt-px shrink-0 text-azul"></span>' +
      '<span>Los datos están completos, pero esta es una versión de demostración: la solicitud no se envió.</span></p>';
    if (window.SurIcons) window.SurIcons.render(estado);
  });
})();
