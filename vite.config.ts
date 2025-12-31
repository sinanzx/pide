import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import componentTagger from './plugins/component-tagger';

export default defineConfig({
  plugins: [react(), componentTagger()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Performance optimizations
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: true,
    cssCodeSplit: true, // Enable CSS code splitting for critical CSS
    rollupOptions: {
      treeshake: true, // Enable aggressive tree-shaking
      output: {
        manualChunks: (id) => {
          // React vendor chunk
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router-dom')) {
            return 'vendor-react';
          }
          // UI vendor chunk
          if (id.includes('node_modules/framer-motion') || id.includes('node_modules/lucide-react') || id.includes('node_modules/clsx') || id.includes('node_modules/tailwind-merge')) {
            return 'vendor-ui';
          }
          // Heavy SDK chunk
          if (id.includes('node_modules/@reclaimprotocol/js-sdk')) {
            return 'heavy-sdk';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
  },
  server: {
    hmr: {
      overlay: true,
      timeout: 15000,
    },
    watch: {
      usePolling: true,
      interval: 500,
      binaryInterval: 500,
    },
  },
});
