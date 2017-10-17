Uniserve Router Dev Environment
------------
Dependencies:
--
* Node - v6.x (includes npm 3.10.10)
* Yarn 1.2.x 
* Postgres 9.2
* PM2 - sudo npm install pm2 -g


Database Setup:
--

[Database Install Guide](../database/README.md)

simon: I had to change 

Deployment:
--
    All done in project root:

    1. yarn install
    2. npm run build
    3. pm2 start dev.config.js
    4. Monitor with pm2 monit or pm2 logs
    5. Stop with pm2 stop all

VSCode Scripts
--
> This should allow you to set breakpoints and launch debugging for the pinging backend and web backend
> put in your local .vscode folder you might have to relaunch vscode to get it to recognize it
>
> [launch.json](../scripts/vscode/launch.json)

