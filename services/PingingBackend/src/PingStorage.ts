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
        for (let record of records) {
            record.datetime = dateStamp;
        }
        if (!(dateStamp.getTime() in this.pingMap)) {
            this.pingMap[dateStamp.getTime()] = records;
        }
    }

    public sendRecords(): void {
        var date: any;
        for (date in this.pingMap) {
            let records: PingRecord[] = this.pingMap[date];
            this.dbInt.storePingRecords(records)
            .then((success: boolean) => {
                if (success) {
                    this.pingMap.delete(date);
                }
            })
        }
    }

}