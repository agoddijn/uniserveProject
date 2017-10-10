import {PingRecord} from './PingRecord'

export interface Device {
    device_recid: number;
    site_recid: number;
    device_id: string;
    manufacturer: string;
    description: string;
    device_type: string;
    mac_address: string;
    ip_address: string;
    //should always be ordered by timestamp
    ping_records?: PingRecord[];
}