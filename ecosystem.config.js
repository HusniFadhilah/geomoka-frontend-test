module.exports = {
    apps: [
        {
            name: 'geosave-frontend',

            // ✅ Script untuk serve
            script: 'npm',

            // ✅ Arguments untuk serve
            args: 'run preview',

            // ✅ Environment variables
            env: {
                NODE_ENV: 'production',
                PORT: 5500
            },

            // ✅ PM2 Settings
            instances: 1,
            exec_mode: 'fork',
            autorestart: true,
            watch: false,
            max_memory_restart: '200M',

            // ✅ Logs
            error_file: './logs/frontend-error.log',
            out_file: './logs/frontend-out.log',
            log_file: './logs/frontend-combined.log',
            time: true,

            // ✅ Restart on crash
            min_uptime: '10s',
            max_restarts: 10,

            // ✅ Environment-specific settings
            env_production: {
                NODE_ENV: 'production',
                PORT: 5500
            }
        }
    ]
};