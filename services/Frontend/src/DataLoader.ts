import {Site} from "../../../modules/common_types/types/Site"
import {Device} from "../../../modules/common_types/types/Device"
import {PingRecord} from '../../../modules/common_types/types/PingRecord'
import {GeoCodingMapper} from './GeoCodingMapper';
//change back to Site[]|string
export class DataLoader{
    loader():Promise<any[]>{
        return new Promise<any[]>((resolve,reject)=>{
            // function loadHelper() {
            //     if(this.status == 200) {
            //         // let datasets:Site[] = JSON.parse(this.response);


            //     } else {
            //         reject("sites not available");
            //     }
            // }
            // let client:any = new XMLHttpRequest();
            // client.onload = loadHelper;
            // client.open('GET', '/ajax/monitoring_api.php?type=devices');
            // client.send();
            let datasets:Site[] = [{
                "site_recid": 1,
                "company_recid": 1,
                "description": "test",
                "address1": "2053 Main Mall",
                "address2": "",
                "city": "Vancouver",
                "province": "BC",
                "postal_code": "",
                "latitude": "",
                "longitude": "",
                "devices": [{
                    "device_recid": 1003,
                    "site_recid": 1002,
                    "device_id": "DB 1",
                    "manufacturer": "Mikrotik",
                    "description": "Sales Database",
                    "device_type": "Database Server",
                    "mac_address": "",
                    "ip_address": "78A907F7CB17.sn.mynetname.net",
                    "ping_records": []
                },{
                    "device_recid": 1003,
                    "site_recid": 1002,
                    "device_id": "DB 1",
                    "manufacturer": "Mikrotik",
                    "description": "Sales Database",
                    "device_type": "Database Server",
                    "mac_address": "",
                    "ip_address": "78A907F7CB17.sn.mynetname.net",
                    "ping_records": []
                },{
                    "device_recid": 1003,
                    "site_recid": 1002,
                    "device_id": "DB 1",
                    "manufacturer": "Mikrotik",
                    "description": "Sales Database",
                    "device_type": "Database Server",
                    "mac_address": "",
                    "ip_address": "78A907F7CB17.sn.mynetname.net",
                    "ping_records": []
                }]
            }, {
                "site_recid": 1,
                "company_recid": 1,
                "description": "test",
                "address1": "350 W Georgia St",
                "address2": "",
                "city": "Vancouver",
                "province": "BC",
                "postal_code": "",
                "latitude": "",
                "longitude": "",
                "devices": [{
                    "device_recid": 1003,
                    "site_recid": 1002,
                    "device_id": "DB 1",
                    "manufacturer": "Mikrotik",
                    "description": "Sales Database",
                    "device_type": "Database Server",
                    "mac_address": "",
                    "ip_address": "78A907F7CB17.sn.mynetname.net",
                    "ping_records": []
                },{
                    "device_recid": 1003,
                    "site_recid": 1002,
                    "device_id": "DB 1",
                    "manufacturer": "Mikrotik",
                    "description": "Sales Database",
                    "device_type": "Database Server",
                    "mac_address": "",
                    "ip_address": "78A907F7CB17.sn.mynetname.net",
                    "ping_records": []
                },{
                    "device_recid": 1003,
                    "site_recid": 1002,
                    "device_id": "DB 1",
                    "manufacturer": "Mikrotik",
                    "description": "Sales Database",
                    "device_type": "Database Server",
                    "mac_address": "",
                    "ip_address": "78A907F7CB17.sn.mynetname.net",
                    "ping_records": []
                }]
            }]
            let promises:Promise<number>[] = datasets.map((data:Site) => {
                return GeoCodingMapper.mapper(data);
            })
            Promise.all(promises).then((result:any[]) => {
                // console.log(result[0][0].geometry.location);
                resolve(result);
            })
        })
    }
    

}
