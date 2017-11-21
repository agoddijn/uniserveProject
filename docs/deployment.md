Server Deployment Guide
============

Assumes server has had dependencies install already, see serverinstall.md for instructions.

Deployment Setup:

    1. Setup deploy key on server https://developer.github.com/v3/guides/managing-deploy-keys/
    2. Setup local deploy script (already done for staging) http://pm2.keymetrics.io/docs/usage/deployment/
    3. Run pm2 deploy <configuration_file> <environment> setup

Deploy:

    pm2 deploy <configuration_file> <environment>
    
    Staging example:

    pm2 deploy staging.config.js staging

    