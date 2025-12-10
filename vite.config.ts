import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Nasłuchuj na wszystkich adresach (0.0.0.0) - kluczowe dla Dockera
    port: 5173,
    watch: {
      usePolling: true, // Wymagane dla hot-reload na Windows/Mac w Dockerze
    },
    // KONFIGURACJA PROXY (To naprawia błędy połączenia!)
    proxy: {
      '/api': {
        target: 'http://nuffi-backend:8000', // Nazwa serwisu z docker-compose
        changeOrigin: true,
        secure: false,
      },
    },
  },
});