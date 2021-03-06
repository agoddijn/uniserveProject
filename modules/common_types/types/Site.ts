import {Device} from './Device'

export interface Site {
    site_recid: number;
    company_recid: number;
    description: string;
    address1: string;
    address2: string;
    city: string;
    province: string;
    postal_code: string;
    latitude: string;
    longitude: string;
    devices?: Device[];
}