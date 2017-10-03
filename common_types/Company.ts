import Site from './Site'

export default interface Company {
    recid: number;
    id: string;
    name: string;
    sites?: Site[];
}