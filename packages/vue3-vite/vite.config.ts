import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // Keep the Vue SFC plugin first for standard Vue compilation.
    vue()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')}}});
