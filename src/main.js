/**
 * GEOSAVE Frontend - Main Entry Point
 * Using Vite + Environment Variables
 */

import config from './config';

// Log startup info
console.log(`
╔════════════════════════════════════════════╗
║   🌍 ${config.app.name} - ${config.app.version}      ║
║   ${config.isDevelopment ? '🔧 Development Mode' : '🚀 Production Mode'}               ║
╚════════════════════════════════════════════╝
`);

console.log('📡 API Endpoint:', config.api.baseUrl);
console.log('🗺️  Default Location:', config.map.defaultCenter);
console.log('⏰ Build Time:', config.app.buildTime);

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ Application initialized successfully');

  // Your existing initialization code here
  if (typeof initializeApp === 'function') {
    initializeApp(config);
  }
});

// Export config for global use
window.APP_CONFIG = config;