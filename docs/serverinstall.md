Server Setup Guide
============

Based on Cent OS 7 Uniserve Server with Postgres already up and running.

Install Guide:

    1. Run /scripts/installdeps.sh
    2. Run /scripts/updatepath.sh
    3. Reset terminal or source ~/.bashrc
    4. npm install pm2 -g

NOTE atm doesn't check if paths already exist spamming update path will pollute .bashrc if it's already been run

Update Guide:

    1. Run /scripts/cleandeps.sh
    2. Run /scripts/installdeps.sh
    3. Clean up old paths from ~/.bashrc (doesn't really matter per say)
    4. Run /scripts/updatepath.sh
    5. Reset terminal or source ~/.bashrc
    6. npm install pm2 -g