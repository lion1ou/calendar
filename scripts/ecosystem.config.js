const path = require('path');

module.exports = {
  apps: [
    {
      name: 'calendar',
      script: 'server-dist/index.js',
      cwd: path.resolve(__dirname),
      env: {
        NODE_ENV: 'production',
      },
      instances: 1,
      autorestart: true,
      max_memory_restart: '256M',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
  ],
};
