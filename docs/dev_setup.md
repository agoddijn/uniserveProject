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

Deployment:
--
    All done in project root:

    1. yarn install
    2. npm run build
    3. pm2 start dev.config.js
    4. Monitor with pm2 monit or pm2 logs
    5. Stop with pm2 stop all

DEBUG=true pm2 start dev.config.js for extra debugging

VSCode Scripts
--
> This should allow you to set breakpoints and launch debugging for the pinging backend and web backend
> put in your local .vscode folder you might have to relaunch vscode to get it to recognize it
>
> [launch.json](../scripts/vscode/launch.json)

Testing:
--
To set up your testing framework

    cd into your package and run:

    1. yarn add --dev mocha
    2. yarn add --dev chai
    3. yarn add --dev @types/mocha
    4. yarn add --dev @types/chai
    5. yarn add --dev sinon
    6. yarn add --dev sinon-chai
    7. npm install -g mocha

Then add the following to your `package.json` scripts

    `"test": "mocha --timeout 10000 -R list"`

This sets the default timeout for tests, which can be overwritten in a test itself, and sets the rporter to list

Then add a `test` directory to your service and add all your `.ts` files in there


