import {Company} from './Company';
import {Site} from './Site';
import {Device} from './Device';

export class DataFaker {

    Company(): Company {
        return {
            recid: 1,
            id: "fakeid",
            name: "fakename"
        };
    }

    Site(): Site {
        return {
            recid: 1;
            company_recid: 1,
            description: "fakesite",
            address1: "fakeaddress1",
            address2: "fakeaddress2",
            city: "fakecity";
            province: string;
            postal_code: string;
            latitude: string;
            longitude: string;
        }
    }
}