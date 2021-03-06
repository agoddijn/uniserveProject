import {Log} from 'uniserve.m8s.utils';
import {DbInterface} from "uniserve.m8s.web.db_interface";
import {PingRecord} from 'uniserve.m8s.types';

export default class PingStorage {

    dbInt: DbInterface;
    pingMap: Map<number,PingRecord[]>;
    pingMapSending: Map<number,PingRecord[]>;

    constructor() {
        Log.trace("PingStorage::init");
        this.pingMap = new Map();
        this.pingMapSending = new Map();
        this.dbInt = new DbInterface();
    };

    public addPingRecords(dateStamp: Date, records: PingRecord[]): void {
        Log.debug("Adding ping records: " + JSON.stringify(records));
        for (let record of records) {
            record.datetime = dateStamp;
        }
        if (!(dateStamp.getTime() in this.pingMap)) {
            this.pingMap.set(dateStamp.getTime(),records);
        }
    }

    public sendRecords(): void {
        var that = this;
        Log.debug("sending ping records");
        let storePromises: Promise<[number, boolean]>[] = [];
        for (let [date, records] of this.pingMap) {
            that.pingMapSending.set(date,records.slice());
            storePromises.push(that.dbInt.storePingRecords(date, records));
        }
        that.pingMap.clear();
        Promise.all(storePromises)
        .then(responses => {
            for (let response of responses) {
                let date = <number>response[0];
                if (response[1]) {
                    that.pingMapSending.delete(date);
                } else {
                    that.pingMap.set(date, that.pingMapSending.get(date));
                    that.pingMapSending.delete(date);
                }
            }
        });
    }
}