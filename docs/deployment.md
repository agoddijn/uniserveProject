Server Deployment Guide
============

Assumes server has had dependencies install already, see serverinstall.md for instructions.

Deployment Setup:

    1. Setup deploy key on server. https://developer.github.com/v3/guides/managing-deploy-keys/
    Git uses id_rsa by default so either change settings or make that id_rsa key.
    2. Setup local deploy script (already done for uniserve server as staging enviroment) http://pm2.keymetrics.io/docs/usage/deployment/
    3. Run pm2 deploy <configuration_file> <environment> setup

Deployment Key Guide:

    You can deploy without a key but it is super painful you will have to enter in the server password ~10 times. Staging uses 
     "~/.ssh/uniservekey"
     Key needs to be added on server to .ssh/authorized_keys

Deploy:

    pm2 deploy <configuration_file> <environment>
    
    Staging example:
    pm2 deploy staging.config.js staging

Manual Deploy:

    1. clone repo
    2. yarn install
    3. npm run build
    4. pm2 start [environment].config.js

Running Tests/Scripts:

Most scripts and tests rely on relevant .env file in project root. 
mv staging.env .env

Or setup .env to match current environment
+
    