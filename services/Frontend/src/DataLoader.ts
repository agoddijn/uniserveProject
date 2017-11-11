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
            let datasets:any[] = [{
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
                    "ping_records": [
                        {
                            "ping_recid": 2388,
                            "device_recid": 1007,
                            "ip_address": "78a90765364c.sn.mynetname.net",
                            "ms_response": 124,
                            "responded": true,
                            "datetime": "2017-11-09T23:58:54.000Z"
                        },
                        {
                            "ping_recid": 2374,
                            "device_recid": 1007,
                            "ip_address": "78a90765364c.sn.mynetname.net",
                            "ms_response": 47,
                            "responded": true,
                            "datetime": "2017-11-09T23:58:15.000Z"
                        },
                        {
                            "ping_recid": 2361,
                            "device_recid": 1007,
                            "ip_address": "78a90765364c.sn.mynetname.net",
                            "ms_response": 35,
                            "responded": true,
                            "datetime": "2017-11-09T23:58:05.000Z"
                        },
                        {
                            "ping_recid": 2349,
                            "device_recid": 1007,
                            "ip_address": "78a90765364c.sn.mynetname.net",
                            "ms_response": 38,
                            "responded": true,
                            "datetime": "2017-11-09T23:57:55.000Z"
                        },
                        {
                            "ping_recid": 2333,
                            "device_recid": 1007,
                            "ip_address": "78a90765364c.sn.mynetname.net",
                            "ms_response": 77,
                            "responded": true,
                            "datetime": "2017-11-09T23:57:26.000Z"
                        }]
                },{
                    "device_recid": 1003,
                    "site_recid": 1002,
                    "device_id": "DB 1",
                    "manufacturer": "Mikrotik",
                    "description": "Sales Database",
                    "device_type": "Database Server",
                    "mac_address": "",
                    "ip_address": "78A907F7CB17.sn.mynetname.net",
                    "ping_records": [
                        {
                            "ping_recid": 2388,
                            "device_recid": 1007,
                            "ip_address": "78a90765364c.sn.mynetname.net",
                            "ms_response": null,
                            "responded": false,
                            "datetime": "2017-11-09T13:58:54.000Z"
                        },
                        {
                            "ping_recid": 2374,
                            "device_recid": 1007,
                            "ip_address": "78a90765364c.sn.mynetname.net",
                            "ms_response": null,
                            "responded": false,
                            "datetime": "2017-11-09T13:58:15.000Z"
                        },
                        {
                            "ping_recid": 2361,
                            "device_recid": 1007,
                            "ip_address": "78a90765364c.sn.mynetname.net",
                            "ms_response": null,
                            "responded": false,
                            "datetime": "2017-11-09T13:58:05.000Z"
                        },
                        {
                            "ping_recid": 2349,
                            "device_recid": 1007,
                            "ip_address": "78a90765364c.sn.mynetname.net",
                            "ms_response": 50,
                            "responded": true,
                            "datetime": "2017-11-09T13:57:55.000Z"
                        },
                        {
                            "ping_recid": 2333,
                            "device_recid": 1007,
                            "ip_address": "78a90765364c.sn.mynetname.net",
                            "ms_response": null,
                            "responded": false,
                            "datetime": "2017-11-09T13:57:26.000Z"
                        }]
                },{
                    "device_recid": 1003,
                    "site_recid": 1002,
                    "device_id": "DB 1",
                    "manufacturer": "Mikrotik",
                    "description": "Sales Database2",
                    "device_type": "Database Server",
                    "mac_address": "",
                    "ip_address": "78A907F7CB17.sn.mynetname.net",
                    "ping_records": [
                        {
                            "ping_recid": 2388,
                            "device_recid": 1007,
                            "ip_address": "78a90765364c.sn.mynetname.net",
                            "ms_response": 100,
                            "responded": true,
                            "datetime": "2017-11-09T13:58:54.000Z"
                        },
                        {
                            "ping_recid": 2374,
                            "device_recid": 1007,
                            "ip_address": "78a90765364c.sn.mynetname.net",
                            "ms_response": 50,
                            "responded": true,
                            "datetime": "2017-11-09T13:58:15.000Z"
                        },
                        {
                            "ping_recid": 2361,
                            "device_recid": 1007,
                            "ip_address": "78a90765364c.sn.mynetname.net",
                            "ms_response": 25,
                            "responded": true,
                            "datetime": "2017-11-09T13:58:05.000Z"
                        },
                        {
                            "ping_recid": 2349,
                            "device_recid": 1007,
                            "ip_address": "78a90765364c.sn.mynetname.net",
                            "ms_response": 12,
                            "responded": true,
                            "datetime": "2017-11-09T13:57:55.000Z"
                        },
                        {
                            "ping_recid": 2333,
                            "device_recid": 1007,
                            "ip_address": "78a90765364c.sn.mynetname.net",
                            "ms_response": 6,
                            "responded": true,
                            "datetime": "2017-11-09T13:57:26.000Z"
                        }]
                }]
            }, {
                "site_recid": 2,
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
                    "description": "Sales Database1002",
                    "device_type": "Database Server",
                    "mac_address": "",
                    "ip_address": "78A907F7CB17.sn.mynetname.net",
                    "ping_records": [
                        {
                            "ping_recid": 2388,
                            "device_recid": 1007,
                            "ip_address": "78a90765364c.sn.mynetname.net",
                            "ms_response": 124,
                            "responded": false,
                            "datetime": "2017-11-09T23:58:54.000Z"
                        },
                        {
                            "ping_recid": 2374,
                            "device_recid": 1007,
                            "ip_address": "78a90765364c.sn.mynetname.net",
                            "ms_response": 47,
                            "responded": false,
                            "datetime": "2017-11-09T23:58:15.000Z"
                        },
                        {
                            "ping_recid": 2361,
                            "device_recid": 1007,
                            "ip_address": "78a90765364c.sn.mynetname.net",
                            "ms_response": 35,
                            "responded": false,
                            "datetime": "2017-11-09T23:58:05.000Z"
                        },
                        {
                            "ping_recid": 2349,
                            "device_recid": 1007,
                            "ip_address": "78a90765364c.sn.mynetname.net",
                            "ms_response": 38,
                            "responded": false,
                            "datetime": "2017-11-09T23:57:55.000Z"
                        },
                        {
                            "ping_recid": 2333,
                            "device_recid": 1007,
                            "ip_address": "78a90765364c.sn.mynetname.net",
                            "ms_response": 77,
                            "responded": false,
                            "datetime": "2017-11-09T23:57:26.000Z"
                        }]
                },{
                    "device_recid": 1003,
                    "site_recid": 1002,
                    "device_id": "DB 1",
                    "manufacturer": "Mikrotik",
                    "description": "Sales Database",
                    "device_type": "Database Server",
                    "mac_address": "",
                    "ip_address": "78A907F7CB17.sn.mynetname.net",
                    "ping_records": [
                        {
                            "ping_recid": 2388,
                            "device_recid": 1007,
                            "ip_address": "78a90765364c.sn.mynetname.net",
                            "ms_response": 124,
                            "responded": false,
                            "datetime": "2017-11-09T23:58:54.000Z"
                        },
                        {
                            "ping_recid": 2374,
                            "device_recid": 1007,
                            "ip_address": "78a90765364c.sn.mynetname.net",
                            "ms_response": 47,
                            "responded": false,
                            "datetime": "2017-11-09T23:58:15.000Z"
                        },
                        {
                            "ping_recid": 2361,
                            "device_recid": 1007,
                            "ip_address": "78a90765364c.sn.mynetname.net",
                            "ms_response": 35,
                            "responded": false,
                            "datetime": "2017-11-09T23:58:05.000Z"
                        },
                        {
                            "ping_recid": 2349,
                            "device_recid": 1007,
                            "ip_address": "78a90765364c.sn.mynetname.net",
                            "ms_response": 38,
                            "responded": false,
                            "datetime": "2017-11-09T23:57:55.000Z"
                        },
                        {
                            "ping_recid": 2333,
                            "device_recid": 1007,
                            "ip_address": "78a90765364c.sn.mynetname.net",
                            "ms_response": 77,
                            "responded": false,
                            "datetime": "2017-11-09T23:57:26.000Z"
                        }]
                },{
                    "device_recid": 1003,
                    "site_recid": 1002,
                    "device_id": "DB 1",
                    "manufacturer": "Mikrotik",
                    "description": "Sales Database",
                    "device_type": "Database Server",
                    "mac_address": "",
                    "ip_address": "78A907F7CB17.sn.mynetname.net",
                    "ping_records": [
                        {
                            "ping_recid": 2388,
                            "device_recid": 1007,
                            "ip_address": "78a90765364c.sn.mynetname.net",
                            "ms_response": 124,
                            "responded": false,
                            "datetime": "2017-11-09T23:58:54.000Z"
                        },
                        {
                            "ping_recid": 2374,
                            "device_recid": 1007,
                            "ip_address": "78a90765364c.sn.mynetname.net",
                            "ms_response": 47,
                            "responded": false,
                            "datetime": "2017-11-09T23:58:15.000Z"
                        },
                        {
                            "ping_recid": 2361,
                            "device_recid": 1007,
                            "ip_address": "78a90765364c.sn.mynetname.net",
                            "ms_response": 35,
                            "responded": false,
                            "datetime": "2017-11-09T23:58:05.000Z"
                        },
                        {
                            "ping_recid": 2349,
                            "device_recid": 1007,
                            "ip_address": "78a90765364c.sn.mynetname.net",
                            "ms_response": 38,
                            "responded": false,
                            "datetime": "2017-11-09T23:57:55.000Z"
                        },
                        {
                            "ping_recid": 2333,
                            "device_recid": 1007,
                            "ip_address": "78a90765364c.sn.mynetname.net",
                            "ms_response": 77,
                            "responded": false,
                            "datetime": "2017-11-09T23:57:26.000Z"
                        }]
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
