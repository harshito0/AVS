import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/crm/' : '/',
  build: {
    outDir: '../../dist/crm',
    emptyOutDir: true,
  },
  server: {
    port: 5174,
    open: false,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
}));

