module.exports = {
  apps: [
    {
      name: process.env.DEPLOY_APP_NAME || 'calendar',
      script: 'server-dist/index.js',
      env: {
        NODE_ENV: 'production',
      },
      instances: 1,
      autorestart: true,
      max_memory_restart: '256M',
    },
  ],
};
