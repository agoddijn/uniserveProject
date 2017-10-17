import {Site} from './Site'

export interface Company {
    recid: number;
    id: string;
    name: string;
    sites: Site[];
}