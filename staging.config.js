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
          "DB_PASS" : 'olivepepsi'
        }
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
          "DB_PASS" : 'olivepepsi'
        }
      }
    ],

    "deploy" : {
      "staging" : {
        "user" : "ubc03",
        "host" : "lab3.uniserve.ca",
        "key": "home/ubc03/.ssh/m8sgitkey",
        // Branch
        "ref"  : "origin/deployment",
        // Git repository to clone
        "repo" : "git@github.com:CPSC319-2017w1/uniserve.m8s.git",
        // Path of the application on target servers
        "path" : "/home/ubc03/uniserve.m8s",
        // Commands to be executed on the server after the repo has been cloned
        "post-deploy" : "yarn install && npm run buildstaging && pm2 startOrRestart staging.config.js"
      },
  
  }
}