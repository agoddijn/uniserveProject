import {PingRecord} from './PingRecord'

export interface Device {
    recid: number;
    site_recid: number;
    id: string;
    manufacturer: string;
    description: string;
    mac_address: string;
    ip_address: string;
    //should always be ordered by timestamp
    ping_records: PingRecord[];
}