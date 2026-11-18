/* Propuesta 02 · Interacciones: menú, submenú, cotización y validación del formulario. */
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

  /* ---------- Servicios: pestañas en escritorio, paneles apilados en móvil ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'));
  var paneles = Array.prototype.slice.call(document.querySelectorAll('.panel'));
  var mqEscritorio = window.matchMedia('(min-width: 1024px)');

  function seleccionar(tab, enfocar) {
    tabs.forEach(function (t) {
      var activo = t === tab;
      t.setAttribute('aria-selected', String(activo));
      t.tabIndex = activo ? 0 : -1;
    });
    if (mqEscritorio.matches) {
      paneles.forEach(function (p) { p.hidden = p.id !== tab.getAttribute('aria-controls'); });
    }
    if (enfocar) tab.focus();
  }
  function modoServicios() {
    var lista = document.getElementById('lista-servicios');
    if (mqEscritorio.matches) {
      lista.removeAttribute('aria-hidden');
      paneles.forEach(function (p) { p.setAttribute('role', 'tabpanel'); });
      seleccionar(tabs.filter(function (t) { return t.getAttribute('aria-selected') === 'true'; })[0] || tabs[0]);
    } else {
      // En móvil todos los paneles quedan visibles como secciones normales.
      paneles.forEach(function (p) { p.hidden = false; p.removeAttribute('role'); });
    }
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { seleccionar(tab); });
    tab.addEventListener('keydown', function (e) {
      var siguiente = null;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') siguiente = tabs[(i + 1) % tabs.length];
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') siguiente = tabs[(i - 1 + tabs.length) % tabs.length];
      if (e.key === 'Home') siguiente = tabs[0];
      if (e.key === 'End') siguiente = tabs[tabs.length - 1];
      if (siguiente) { e.preventDefault(); seleccionar(siguiente, true); }
    });
  });
  mqEscritorio.addEventListener('change', modoServicios);
  modoServicios();

  // Enlaces del submenú: abren la pestaña del servicio correspondiente.
  document.querySelectorAll('[data-ir-servicio]').forEach(function (enlace) {
    enlace.addEventListener('click', function () {
      var tab = document.getElementById('tab-' + enlace.getAttribute('data-ir-servicio'));
      if (tab) seleccionar(tab);
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
    var barra = document.getElementById('barra-cotizar');
    var estado = { contacto: false, pie: false };
    // «WhatsApp siempre a mano» (guía): visible desde la portada. Se oculta solo donde ya hay otro
    // acceso: Contacto, el pie, el menú móvil abierto o la barra inferior móvil (que trae su propio botón).
    var actualizar = function () {
      var menuAbierto = menu && !menu.hidden;
      var barraActiva = barra && barra.getAttribute('data-visible') === 'true' && barra.getClientRects().length > 0;
      flotante.setAttribute('data-visible', String(!estado.contacto && !estado.pie && !menuAbierto && !barraActiva));
    };
    var observar = function (el, clave) {
      if (!el) return;
      new IntersectionObserver(function (entradas) {
        estado[clave] = entradas[0].isIntersecting;
        actualizar();
      }).observe(el);
    };
    document.documentElement.classList.add('wsp-activo');
    observar(document.getElementById('contacto'), 'contacto');
    observar(document.querySelector('footer'), 'pie');
    if (barra && 'MutationObserver' in window) {
      new MutationObserver(actualizar).observe(barra, { attributes: true, attributeFilter: ['data-visible'] });
    }
    window.addEventListener('resize', actualizar);
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
