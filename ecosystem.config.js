module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [
    // Web Backend
    {
      name      : 'Web Backend',
      script    : './services/WebBackend/src/WebBackend.js',
      env: {
        "NODE_ENV": "development",
        "PORT"    : 3031,
        "PHP_AUTH_TOKEN": "DEVTOKEN"       
      },
      env_staging : {
        "NODE_ENV": 'production',
        "PORT"    : 3031,
        "PHP_AUTH_TOKEN": "tfFu9iEUfNjmW6Oj3sOSPS4BKGeBKTaJ"
      }
    },

    // Pinger
    {
      name      : 'Pinger',
      script    : './services/PingingBackend/src/PingingBackend.js'
    }
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy : {
    production : {
      user : 'node',
      host : '212.83.163.1',
      ref  : 'origin/master',
      repo : 'git@github.com:repo.git',
      path : '/var/www/production',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    },
    dev : {
      user : 'node',
      host : '212.83.163.1',
      ref  : 'origin/master',
      repo : 'git@github.com:repo.git',
      path : '/var/www/development',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env dev',
      env  : {
        NODE_ENV: 'dev'
      }
    }
  }
};
