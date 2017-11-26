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
        "DB_PASS" : '',
        "MAPS_KEY": 'AIzaSyDkDqXvVsLgxlM2Wt-c0ixl0Ov2C-9AJDE'
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
        "DB_PASS" : '',
        "PING_INTERVAL": 60000, // Interval to ping devices (ms) 1min
        "PING_NEWDEVS": 4.32e7 // Interval to get all devices (ms) 12hour
      }
  },

  {
    name      : 'Aggregator',
    script    : './services/DataAggregator/src/DataAggregator.js',
    env: {
      "DB_HOST" : 'localhost',
      "DB_PORT" : 5432,
      "DB_NAME" : 'ubc03',
      "DB_USER" : 'postgres',
      "DB_PASS" : ''
    },
    "autorestart": false,
    "exec_mode"  : "cluster_mode",
    "instances"  : 1,
    "cron_restart": "0-59 * * * *"
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
