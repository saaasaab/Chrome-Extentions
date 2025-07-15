import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        contentScript: resolve(__dirname, 'src/contentScript.js'),
        widget: resolve(__dirname, 'src/widget/widget.js'),
        background: resolve(__dirname, 'src/background.js'),
        popup: resolve(__dirname, 'src/popup/popup.js'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      'lib': resolve(__dirname, 'lib'),
    },
  },
  define: {
    global: 'globalThis',
  },
}); 