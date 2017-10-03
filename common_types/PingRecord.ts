export default interface PingRecord {
    device_id: number;
    ip_address: string;
    ms_response: number;
    responded: boolean;
    datetime: number;
}