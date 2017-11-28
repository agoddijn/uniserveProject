DB Utils
==

npm run build, not built by root level build.

Clean out database:
node resetUniserveDB.js

Fill older tables and part of msp_ping:
node fillPingDBUniserve.js [low error rate] [high error rate]

Fill rest of msp_ping up to date:
node topupPingDBUniserve.js [low error rate] [high error rate]





