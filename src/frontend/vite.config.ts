import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  build: {
    minify: false,
  },
  esbuild: {
    jsxInject: `console.log('hello!')`,
  },
});
