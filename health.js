// Simple health check endpoint untuk Railway
// Place this in public/health.js or create endpoint in main app

// This file will be served by Vite as a static file
export default {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || '8080'
};
