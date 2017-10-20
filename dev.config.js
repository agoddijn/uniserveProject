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
        "WEBBACKEND_PORT": 3031,
        "PHP_AUTH_TOKEN": "DEVTOKEN" ,
        "DB_HOST" : 'localhost',
        "DB_PORT" : 5432,
        "DB_NAME" : 'ubc03',
        "DB_USER" : 'postgres',
        "DB_PASS" : ''
      }

    },
  
  // Pinger
  {
      name      : 'Pinger',
      script    : './services/PingingBackend/src/PingingBackend.js',
      env: {
        "DB_HOST" : 'localhost',
        "DB_PORT" : 5432,
        "DB_NAME" : 'ubc03',
        "DB_USER" : 'postgres',
        "DB_PASS" : ''
      }
  },

  //PHP Shim
  {
    name      : 'PHP Shim',
    script    : './modules/php_shim/php_shim.js',
    env: {
      "NODE_ENV": "development",
      "WEBBACKEND_PORT"    : 3031,
      "PHP_AUTH_TOKEN": "DEVTOKEN"
    }

  }
]

};
