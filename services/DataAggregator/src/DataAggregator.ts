import { Log } from 'uniserve.m8s.utils';
import { DbInterface } from 'uniserve.m8s.web.db_interface'

async function migrate() {
    try {
        let DbInt = new DbInterface;

        Log.info("Starting 30 Day Migration");
        const d30status = await DbInt.migrate30DayData();
        if (d30status[1]) {
            Log.info(d30status[0]);
            Log.info("30 Day Migration Success");
        } else {
            Log.error("30 Day Migration Fail");
        }

        Log.info("Starting 30 Day Migration");
        const d60status = await DbInt.migrate60DayData();
        if (d30status[1]) {
            Log.info("60 Day Migration Success");
        } else {
            Log.error("60 Day Migration Fail");
        }

        //Log.info("Starting Old Data Deletion");
        //const deletionstatus = await DbInt.delete90DayOldRecords

    } catch (e) {
        Log.error("DataAggregator/DataAggregator.ts ERROR: " + JSON.stringify(e));
    }

    return true;
}

migrate();

