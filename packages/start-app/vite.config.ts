import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import { defineConfig } from 'vite';
import viteReact from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

const appRoot = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 3000,
    proxy: { '/api': { target: 'http://laravel:8000', changeOrigin: false } },
  },
  resolve: {
    tsconfigPaths: true,
    alias: { '@': appRoot },
  },
  plugins: [tanstackStart(), viteReact()],
});
