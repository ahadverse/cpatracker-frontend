import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  // Pinned port so this app never grabs network-admin's 5173, which would break
  // the "View as Tenant" impersonation link.
  server: { port: 5176, strictPort: true },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
