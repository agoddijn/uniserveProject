Uniserve Router Monitoring Project
------------
### Dependencies: ###

* Node - v6.x (includes npm 3.10.10)

* pm2 - sudo npm install pm2 -g
* http://pm2.keymetrics.io/docs/usage/quick-start/

* yarn - https://yarnpkg.com/en/docs/install#linux-tab

* tsc - npm install -g typescript 

### Deployment: ###

in root:
yarn install

npm run build

* to start everything:
pm2 start ecosystem.config.js

monitor logs:
pm2 logs

monitor proccesses:
pm2 list or pm2 monit

