/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Unified "Народная" palette:
        //   background  #292623
        //   accent      #ffe5ff  (use opacity variants for softer tones)
        primary: '#ffe5ff',      // accent / text
        accent: '#ffe5ff',       // hover accent (same hue, full strength)
        secondary: '#1f1d1b',
        // Legacy "ink" shades remapped to variations around the single
        // #292623 background so existing ink-* classes stay on-theme.
        ink: {
          900: '#211e1c',        // deepest background (overlays, image wells)
          800: '#292623',        // primary app background
          700: '#322e2a',        // card / surface
          600: '#433e39',        // borders / dividers
        },
      },
      fontFamily: {
        display: ['Orbitron', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Exo 2', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 12px rgba(255, 229, 255, 0.30)',
      },
    },
  },
  plugins: [],
}
