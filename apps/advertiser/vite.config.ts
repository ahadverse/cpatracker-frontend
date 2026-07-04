import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  // Pinned port so the multi-app dev setup uses deterministic, collision-free
  // ports (network-admin 5173, affiliate 5174, advertiser 5175, super-admin 5176).
  server: { port: 5175, strictPort: true },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
