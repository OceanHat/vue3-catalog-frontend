/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Sci-fi museum catalog palette ("Народная")
        primary: '#E9C7E6',      // soft pink/lavender accent
        accent: '#F3D6F0',       // lighter accent for hover
        secondary: '#292623',
      },
      fontFamily: {
        display: ['Orbitron', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Exo 2', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 12px rgba(233, 199, 230, 0.35)',
      },
    },
  },
  plugins: [],
}
