import {Site} from './Site'

export interface Company {
    company_recid: number;
    company_id: string;
    company_name: string;
    sites?: Site[];
}
