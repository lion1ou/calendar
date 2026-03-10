import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [vue()],
  server: {
    open: false,
    host: '127.0.0.1',
    port: 9091,
    proxy: {
      '/cApi': {
        target: 'http://127.0.0.1:5555',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/cApi/, ''),
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'naive-ui': ['naive-ui'],
          'vue-vendor': ['vue', 'vue-router', 'vuex'],
        },
      },
    },
  },
});
