export interface PingRecord {
    ping_recid: number;
    device_recid: number;
<<<<<<< HEAD:common_types/types/PingRecord.ts
=======
    ip_address?: string;
>>>>>>> c05f1ee74786bc9eb5349d5cdcf407a36fb1da32:modules/common_types/types/PingRecord.ts
    ms_response: number;
    responded: boolean;
    datetime: Date;
}