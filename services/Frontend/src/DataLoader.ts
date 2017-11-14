import {Site} from "../../../modules/common_types/types/Site"
import {Device} from "../../../modules/common_types/types/Device"
import {PingRecord} from '../../../modules/common_types/types/PingRecord'

//change back to Site[]|string
export class DataLoader{
    private dataset:Site[] = [];
    findSiteById(id:number, sites:Site[]):Site{
        let site:Site;
        for(let i=0;i<sites.length;i++){
            if(sites[i].site_recid === id){
                site = sites[i];
            }
        }
        return site;
    }
    loader():Promise<any[]>{
        return new Promise<any[]>((resolve,reject)=>{
            function loadHelper() {
                if(this.status == 200) {
                    let datasets:Site[] = JSON.parse(this.response);
                    resolve(datasets)

                } else {
                    reject("sites not available");
                }
            }
            let client:any = new XMLHttpRequest();
            client.onload = loadHelper;
            client.open('GET', '/ajax/monitoring_api.php?type=devices');
            client.send();
        })
    }
    

}
