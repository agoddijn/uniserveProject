import Device from './Device'
import Site from './Site'

//this is will be highly depenant on what we have access to via cookies/login
export interface HTTPMainPageRequest {
    company_recid: number;
    
}

export interface HTTPMainPageResponse {
    sites: Site[];
}