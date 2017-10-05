export interface PingRecord {
    ping_recid: number;
    device_id: number;
    ms_response: number;
    responded: boolean;
    datetime: Date;
}