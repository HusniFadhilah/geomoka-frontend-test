/**
 * Application Configuration
 * Centralized config management using Vite environment variables
 */

const config = {
    // API Configuration
    api: {
        baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8086/api',
        timeout: 240000, // 4 minutes
    },

    // Application Info
    app: {
        name: import.meta.env.VITE_APP_NAME || 'GEOSAVE',
        title: import.meta.env.VITE_APP_TITLE || 'GEOSAVE Platform',
        version: __APP_VERSION__ || '1.0.0',
        buildTime: __BUILD_TIME__ || new Date().toISOString(),
    },

    // Map Configuration
    map: {
        defaultCenter: {
            lat: parseFloat(import.meta.env.VITE_DEFAULT_LAT) || -6.9667,
            lng: parseFloat(import.meta.env.VITE_DEFAULT_LNG) || 110.4167,
        },
        defaultZoom: parseInt(import.meta.env.VITE_DEFAULT_ZOOM) || 10,
        maxZoom: 18,
        minZoom: 5,
    },

    // Features Toggle
    features: {
        debug: import.meta.env.VITE_ENABLE_DEBUG === 'true',
        analytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    },

    // API Keys
    keys: {
        googleMaps: import.meta.env.VITE_GOOGLE_MAPS_KEY || '',
    },

    // Development mode check
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
};

// Log config in development
if (config.isDevelopment && config.features.debug) {
    console.log('🔧 Application Configuration:', config);
}

export default config;