import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import appdevDesignMode from '@xagi/vite-plugin-design-mode';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // Keep the Vue SFC plugin first for standard Vue compilation.
    vue(),
    // Enable design-mode capabilities used by XAGI runtime integrations.
    appdevDesignMode(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
