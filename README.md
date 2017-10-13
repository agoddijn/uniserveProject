Uniserve Router Monitoring Project
------------

Dev Docs 
--
* [Dev Environment Setup](/docs/dev_setup.md)
* [Server Install/Update](/docs/serverinstall.md)
* [Changes to PHP](/docs/php_changes.md)

Project Structure
~~~~
├── database                    DB Schema/Starter Files
├── dev.config.js               PM2 Config File for Dev
├── staging.config.js           PM2 Config File for Staging(Uniserve Server)
├── docs                        Documentation

├── modules                     Modules used by multiple services/testing
│   ├── common_types            Common Types
│   ├── data_faker              Creates Fake Data for testing  
│   ├── db_interface            DB Interface for services
│   ├── db_utils                DB Utils for testing
│   ├── php_shim                PHP Shim for Dev
│   └── utils                   Misc Utils ie Log

├── scripts                     Misc scripts
│   └── vscode                  Useful scripts for developing in vs code

├── services                    Main Project
│   ├── DataAggregator          Nightly Cron Job Condensing/Removing outdated data
│   ├── Frontend                User facing react app
│   ├── PingingBackend          Handles pining devices and storing in database    
│   └── WebBackend              Gets data for front end

├── php_root                    Has the base Uniserve project with required changes

├── test                        E2e and Integration tests
└── utils                       Will be depreciated soon with stuff moved to modules
~~~~


