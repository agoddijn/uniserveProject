import {Log, DbInterface} from 'uniserve.m8s.utils';
import {PingRecord} from 'uniserve.m8s.types'

export default class PingStorage {

    dbInt: DbInterface;
    pingMap: Map<number,PingRecord[]>;
    pingMapSending: Map<number,PingRecord[]>;

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
        let storePromises: Promise<[number, boolean]>[] = [];
        for (let [date, records] of this.pingMap) {
            // console.log("Storing " + JSON.stringify(records));
            storePromises.push(that.dbInt.storePingRecords(records))
            that.pingMapSending.set(date, records);
            that.pingMap.delete(date);
        }
        Promise.all(storePromises)
        .then(responses => {
            for (let response of responses) {
                let date = <number>response[0];
                if (response[1]) {
                    // console.log("Deleting " + date);
                    that.pingMapSending.delete(date);
                } else {
                    that.pingMap.set(date, that.pingMapSending[date]);
                    that.pingMapSending.delete(date);
                }
            }
        });
    }

}