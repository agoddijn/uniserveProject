import {Log, DbInterface} from 'uniserve.m8s.utils';
import {PingRecord} from 'uniserve.m8s.types'

export default class PingStorage {

    dbInt: DbInterface;
    pingMap: Map<number,PingRecord[]>;

    constructor() {
        console.log("PingStorage::init");
        this.pingMap = new Map();
        this.dbInt = new DbInterface();
    };

    public addPingRecords(dateStamp: Date, records: PingRecord[]): void {
        // console.log("Adding ping records: " + JSON.stringify(records));
        for (let record of records) {
            record.datetime = dateStamp;
        }
        if (!(dateStamp.getTime() in this.pingMap)) {
            this.pingMap.set(dateStamp.getTime(),records);
        }
    }

    public sendRecords(): void {
        var that = this;
        // console.log("sending ping records");
        let storePromises: Promise<boolean | number>[] = [];
        for (let [date, records] of this.pingMap) {
            // console.log("Storing " + JSON.stringify(records));
            storePromises.push(this.dbInt.storePingRecords(records))
        }
        Promise.all(storePromises)
        .then(dates => {
            for (let date of dates) {
                if (date) {
                    // console.log("Deleting " + date);
                    date = <number>date;
                    that.pingMap.delete(date);
                }
            }
        });
    }

}