export interface PingRecord {
    ping_recid: number;
    device_recid: number;
    ms_response: number;
    responded: boolean;
    datetime: Date;
}