// frontend\vite.config.js

import { defineConfig } from 'vite'

export default defineConfig({
    root: '.',
    base: '/',
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        emptyOutDir: true,
        sourcemap: false,
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                admin: resolve(__dirname, 'admin.html'),
            },
            output: {
                manualChunks: undefined
            }
        }
    },
    server: {
        port: 5500,
        host: true,
        open: false
    },
    preview: {
        port: 5500,
        host: true,
        allowedHosts: [
            '.len.co.id',
            '.husnifd.my.id',
        ]
    },
    // ✅ Transform HTML to inject env vars
    transformIndexHtml: (html) => {
        return html
            .replace('%VITE_APP_TITLE%', process.env.VITE_APP_TITLE || 'GEOSAVE')
            .replace('http://localhost:5500', process.env.VITE_API_BASE_URL || 'http://localhost:5500')
            .replace("'development'", `'${process.env.VITE_ENV || 'development'}'`);
    }
})