Server setup for deployment:

1. Setup deploy key on server https://developer.github.com/v3/guides/managing-deploy-keys/
2. Setup local deploy script http://pm2.keymetrics.io/docs/usage/deployment/
3. Run pm2 deploy <configuration_file> <environment> setup

Redeploy:

pm2 deploy <configuration_file> <environment>  (env blank in this case because we use seperate files)