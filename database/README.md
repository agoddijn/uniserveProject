## Setting up your environment with PostgreSQL and initializing the database.

1. Install PostgreSQL following these [steps](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-postgresql-on-ubuntu-16-04)
2. Install PgAdmin from [here](https://www.pgadmin.org/)
3. Once those are setup, start PostgreSQL on the command line using the command `sudo -u postgres psql` and enter the following query: `CREATE DATABASE ubc03;`
4. Psql should return with `CREATE DATABASE` if it has been succesfully created.
5. On PgAdmin, hit refresh and the new database should appear under Server Groups -> Servers -> localhost -> Databases
6. To connect to the newly created database, click on the "plug" icon (top left corner) and enter the following information in the New Server Registration form:
* Name: ubc03
* Host: localhost
* Port: 5432 (this should be the default)
* Username: postgres

7. Once the connection has gone through, clicking on the database should now cause a bunch of drop down items to appear (Catalogs, Event Triggers, Extensions, Schemas and Slony Replication), but no tables.
8. To initialize the tables, run the following command from the command line `psql -h localhost -d ubc03 -U postgres -p 5432 -a -q -f /path/to/schema.sql`
You may be prompted to enter your password.
9. To confirm the succesful completion of the script, refresh PgAdmin and nagivate to tables (Server Groups -> Servers -> Databases -> ubc03 -> Schemas -> Tables) and you should see 4 of them.
10. To fill with data, use the same command as in step 8) and run them with the following files in the following order:

* insert_msp_company.sql
* insert_msp_site.sql
* insert_msp_device.sql

11.Once those are complete, refesh PgAdmin and the tables should be populated.


No PWORD Error
--

If you get " Error: Error connecting to the server: fe_sendauth: no password supplied"

    1. Enter psql: `sudo -u postgres psql`
    2. Open the file it says
    3. Near bottom of file change all the local trust methods to trust ie:
        # "local" is for Unix domain socket connections only
        local   all             all                                     trust
        # IPv4 local connections:
        host    all             all             127.0.0.1/32            trust
        # IPv6 local connections:
    4. In psql: SELECT `pg_reload_conf();`


