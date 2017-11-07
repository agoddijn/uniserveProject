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
          "PORT"    : 3031,
          "PHP_AUTH_TOKEN": "tfFu9iEUfNjmW6Oj3sOSPS4BKGeBKTaJ",
          "DB_HOST" : 'localhost',
          "DB_PORT" : 5432,
          "DB_NAME" : 'ubc03',
          "DB_USER" : 'ubc03',
          "DB_PASS" : 'olivepepsi'
        }
      },
  
      // Pinger
      {
        name      : 'Pinger',
        script    : './services/PingingBackend/src/PingingBackend.js',
        env : {
          "NODE_ENV": 'staging',
          "PORT"    : 3031,
          "DB_HOST" : 'localhost',
          "DB_PORT" : 5432,
          "DB_NAME" : 'ubc03',
          "DB_USER" : 'ubc03',
          "DB_PASS" : 'olivepepsi'
        }
      }
    ],

    "deploy" : {
      "staging" : {
        "user" : "ubc03",
        // Multi host is possible, just by passing IPs/hostname as an array
        "host" : "lab3.uniserve.com",
        // Branch
        "ref"  : "origin/staging",
        // Git repository to clone
        "repo" : "git@github.com:CPSC319-2017w1/uniserve.m8s.git",
        // Path of the application on target servers
        "path" : "~/",
        // Commands to be executed on the server after the repo has been cloned
        "post-deploy" : "yarn install && npm run buildstaging && pm2 startOrRestart staging.config.js"
      },
  
  }
}