import path from 'path';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
          '/api-wl': {
            target: 'https://www.wienerlinien.at',
            changeOrigin: true,
            secure: false,
            rewrite: (path) => path.replace(/^\/api-wl/, ''),
          },
        },
      },
      base: '/',
      plugins: [
        react(),
        tailwindcss()
      ],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, 'src'),
        }
      }
    };
});
