Server Deployment Guide
============

Considerations for moving the application to an actual production environment.



    1. The module that does the actual pinging (ping/sysping) meets the project goals but is somewhat slow and should be swapped with something that doesn't use the system pinger as it causes forking.

    2. Map API key is free one only supports 2500 geocoding calls. Two API keys one for server (located in pm2 config files) and client side located in.

    3. Maybe reduce the 60s ping time or retention, there is variable in pm2 config files for ping time spacing

    4.Aggregator runs once a minute which actually works reasonably well as it doesn't need to do too much work each run. 
    