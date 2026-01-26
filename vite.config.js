import { defineConfig, loadEnv } from 'vite';
import path from 'path';

export default defineConfig(({ mode }) => {
    // Load env file based on mode
    const env = loadEnv(mode, process.cwd(), '');

    return {
        // Base public path
        base: './',

        // Server configuration
        server: {
            port: 5500,
            host: true, // Listen on all addresses
            cors: true,
            open: true, // Auto open browser

            // Proxy API requests (optional - for CORS issues)
            proxy: {
                '/api': {
                    target: env.VITE_API_BASE_URL || 'http://localhost:8086/api',
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api/, ''),
                },
            },
        },

        // Build configuration
        build: {
            outDir: 'dist',
            assetsDir: 'assets',
            sourcemap: mode === 'development',

            // Optimize chunks
            rollupOptions: {
                output: {
                    manualChunks: {
                        'vendor': ['jquery'],
                        'maps': ['leaflet'],
                        'charts': ['chart.js'],
                    },
                },
            },

            // Minification
            minify: 'terser',
            terserOptions: {
                compress: {
                    drop_console: mode === 'production',
                },
            },
        },

        // Resolve aliases
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
                '@assets': path.resolve(__dirname, './public'),
            },
        },

        // Define global constants
        define: {
            __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
            __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
        },

        // Preview configuration (for production build preview)
        preview: {
            port: 8080,
            host: true,
        },
    };
});