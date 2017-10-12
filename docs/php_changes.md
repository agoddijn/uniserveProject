PHP Changes
============

    */folder/file:line numbers
    
    1. config/config.php:31 
        Changed DB password
    2. modules/monitor/menu.php:20
        Removed submenus, navigation will be handled in app.
    3. modules/monitor/location/
        Removed all files except the switch
    4. templates/api.php
        php file for handling proxy to JS backend this is where most of the stuff is
    5. config/config.php:35
        settings for the api
    
User authentication is handled via check of $gUser->id.
The node-php auth happens via auth token set in config.php and pm2 config via env variable

**Issues:**

    *Node-PHP com goes over http, not a big deal ATM as they are on same box

    *Node-PHP auth tokens checked into repo