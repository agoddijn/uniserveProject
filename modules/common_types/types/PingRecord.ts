export interface PingRecord {
    ping_recid: number;
    device_recid: number;
    ip_address?: string;
    ms_response: number;
    responded: boolean;
    datetime: Date;
    ip_address: string;
}