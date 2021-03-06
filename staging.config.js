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
        env : {
          "NODE_ENV": 'staging',

          "WEBBACKEND_PORT": 3031,
          "PHP_AUTH_TOKEN": "tfFu9iEUfNjmW6Oj3sOSPS4BKGeBKTaJ",
          "DB_HOST" : 'localhost',
          "DB_PORT" : 5432,
          "DB_NAME" : 'ubc03',
          "DB_USER" : 'ubc03',
          "DB_PASS" : 'olivepepsi',
          "MAPS_KEY": 'AIzaSyDkDqXvVsLgxlM2Wt-c0ixl0Ov2C-9AJDE'          
        },
        "log_file": "/home/ubc03/logs/webbackend-combined.log"
      },
  
      // Pinger
      {
        name      : 'Pinger',
        script    : './services/PingingBackend/src/PingingBackend.js',
        env : {
          "NODE_ENV": 'staging',
          "DB_HOST" : 'localhost',
          "DB_PORT" : 5432,
          "DB_NAME" : 'ubc03',
          "DB_USER" : 'ubc03',
          "DB_PASS" : 'olivepepsi',
          "PING_INTERVAL": 60000, // Interval to ping devices (ms) 1min
          "PING_NEWDEVS": 4.32e7 // Interval to get all devices (ms) 12hour
        },
        "log_file": "/home/ubc03/logs/pinger-combined.log"
      },

    {
      name      : 'Aggregator',
      script    : './services/DataAggregator/src/DataAggregator.js',
      env: {
        "NODE_ENV": 'staging',
        "DB_HOST" : 'localhost',
        "DB_PORT" : 5432,
        "DB_NAME" : 'ubc03',
        "DB_USER" : 'ubc03',
        "DB_PASS" : 'olivepepsi',
      },
      "log_file": "/home/ubc03/logs/aggregator-combined.log",
      "autorestart": false,
      "exec_mode"  : "cluster_mode",
      "instances"  : 1,
      "cron_restart": "0-59 * * * *"
    },
  ],

    "deploy" : {
      "staging" : {
        "user" : "ubc03",
        "key": "~/.ssh/uniservekey",
        "host" : "lab3.uniserve.ca",
        // Branch
        "ref"  : "origin/uniservestaging",
        // Git repository to clone
        "repo" : "git@github.com:CPSC319-2017w1/uniserve.m8s.git",
        // Path of the application on target servers
        "path" : "/home/ubc03/uniserve.m8s",
        //fix for older git version
        "pre-deploy": "git pull",
        // Commands to be executed on the server after the repo has been cloned
        "post-deploy" : "yarn install && npm run buildstaging && pm2 startOrRestart staging.config.js"
      },
  
  }
}