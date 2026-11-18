/** Tokens tomados de desing_v2/style-guide-summary.md (v0.2, acento Turquesa Cotizar). */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [__dirname + '/index.html', __dirname + '/src/**/*.js'],
  theme: {
    screens: { sm: '640px', md: '768px', lg: '1024px', xl: '1200px' },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      azul: '#053260',      // Primario · Azul Sur
      verde: '#3A753E',     // Secundario · Verde Sur (filetes, íconos, bordes)
      turquesa: '#2BB3C0',  // Acento · Turquesa Cotizar: solo la acción de cotizar (texto azul encima, 5,09:1)
      blanco: '#FFFFFF',    // Fondo / texto sobre azul
      grafito: '#1B2733',   // Texto principal
      pizarra: '#55616C',   // Texto secundario
      niebla: '#EEF3F6',    // Fondo alterno
      exito: '#1E7A3C',
      error: '#B3261E',
    },
    fontFamily: {
      titulo: ['Manrope', 'system-ui', 'sans-serif'],
      texto: ['"Source Sans 3"', 'system-ui', 'sans-serif'],
      mono: ['"Source Code Pro"', 'ui-monospace', 'monospace'],
    },
    // Escala modular: razón 1,2 en móvil → 1,25 en escritorio, base 16 px.
    fontSize: {
      sm: ['0.875rem', { lineHeight: '1.5' }],
      base: ['1rem', { lineHeight: '1.5' }],
      lg: ['clamp(1.2rem, 1.13rem + 0.3vw, 1.25rem)', { lineHeight: '1.5' }],
      xl: ['clamp(1.44rem, 1.3rem + 0.6vw, 1.563rem)', { lineHeight: '1.35' }],
      '2xl': ['clamp(1.728rem, 1.5rem + 1vw, 1.953rem)', { lineHeight: '1.25' }],
      '3xl': ['clamp(2.074rem, 1.7rem + 1.6vw, 2.441rem)', { lineHeight: '1.2' }],
      '4xl': ['clamp(2.488rem, 1.9rem + 2.5vw, 3.052rem)', { lineHeight: '1.12' }],
      '5xl': ['clamp(2.986rem, 2.1rem + 3.8vw, 3.815rem)', { lineHeight: '1.06' }],
    },
    borderRadius: { none: '0', DEFAULT: '4px', full: '9999px' },
    extend: {
      maxWidth: { contenedor: '1200px', lectura: '66ch' },
      transitionDuration: { rapido: '150ms', medio: '250ms' },
      transitionTimingFunction: { DEFAULT: 'ease-out' },
    },
  },
  plugins: [],
};
