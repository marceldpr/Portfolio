import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  publicDir: false,
  server: {
    port: 3333,
  },
  plugins: [
    {
      name: 'clean-urls',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = req.url.split('?')[0];
          // If path has no extension and doesn't end with /, add trailing slash
          // so Vite resolves work/alana-platform → work/alana-platform/index.html
          if (!url.endsWith('/') && !url.includes('.')) {
            req.url = url + '/';
          }
          next();
        });
      },
    },
  ],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        alana: 'work/alana-platform/index.html',
        copilot: 'work/copilot-agent-builder/index.html',
        alanaDS: 'work/alana-design-system/index.html',
        uiForge: 'work/ui-forge/index.html',
      },
    },
  },
});
