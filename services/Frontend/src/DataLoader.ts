import {Site} from "../../../modules/common_types/types/Site"
import {Device} from "../../../modules/common_types/types/Device"
import {PingRecord} from '../../../modules/common_types/types/PingRecord'
import axios from 'axios';

//change back to Site[]|string
export class DataLoader{
    loader():Promise<any[]>{
        return new Promise<any[]>((resolve,reject)=>{
            axios.get('/ajax/monitoring_api.php?type=devices')
            .then((data: any) => {
                resolve(data.data);
            })
            .catch((err: any) => {
                console.log(err);
                alert("Could not get data\n" + err);
            })
        })
    }
    

}