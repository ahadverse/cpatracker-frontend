import preset from '@cpatracker/config/tailwind-preset.js';
import animate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
  presets: [preset],
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  plugins: [animate],
};
