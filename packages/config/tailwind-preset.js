// Placeholder Tailwind preset shared by every app. Stage 1 replaces this with
// the real Trakaff-style dark dashboard tokens (background, surface, border,
// text, accent, status colors). For now it just proves the workspace wiring.
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surface: '#0f1115',
        accent: '#6366f1',
      },
    },
  },
  plugins: [],
};
