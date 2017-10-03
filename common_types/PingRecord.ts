export default interface PingRecord {
    ping_recid: number;
    device_id: number;
    ip_address: string;
    ms_response: number;
    responded: boolean;
    datetime: Date;
}