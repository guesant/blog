import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import { defineConfig } from 'vite';
import viteReact from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

const sourceRoot = fileURLToPath(new URL('./src/', import.meta.url));

const assetRevision = 'v2';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 3000,
    proxy: { '/api': { target: 'http://laravel:8000', changeOrigin: false } },
  },
  resolve: {
    tsconfigPaths: true,
    alias: { '@': sourceRoot },
  },
  build: {
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        assetFileNames: `assets/[name]-[hash]-${assetRevision}.[ext]`,
        chunkFileNames: `assets/[name]-[hash]-${assetRevision}.js`,
        entryFileNames: (chunk) =>
          chunk.name === 'server' ? 'server.js' : `assets/[name]-[hash]-${assetRevision}.js`,
      },
    },
  },
  plugins: [
    tanstackStart({
      router: {
        routeFileIgnorePattern:
          '^(?:site-route-context\\.tsx|site--locale-layout\\.tsx|splat-(?:request-for-path|metadata-for-route)\\.tsx|splat-metadata-(?:default|kind|page|article)\\.ts|splat-detail-route-path\\.ts|splat--splat-route\\.tsx)$',
      },
    }),
    viteReact(),
  ],
});
