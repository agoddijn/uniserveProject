import Device from './Device'
import Site from './Site'

//this is will be highly depenant on what we have access to via cookies/login
export interface HTTPDetailsPageRequest {
    company_recid: number;
    
}

export interface HTTPDetailsPageResponse {
    sites: Site[];
}