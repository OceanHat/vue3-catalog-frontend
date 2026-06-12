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
        secondary: '#1F2937',
        ink: {
          900: '#16140F',        // near-black warm background
          800: '#1E1B16',        // panel background
          700: '#2A2620',        // card surface
          600: '#3A352D',        // borders / dividers
        },
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
