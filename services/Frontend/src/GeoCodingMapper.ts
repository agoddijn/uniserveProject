import { Site } from "../../../modules/common_types/types/Site"
import { mp } from './MapClientInstance'

// replace number with site;
export class GeoCodingMapper{
    static mapper(data:Site):Promise<any>{
        return new Promise<any>((resolve:any) =>{
            let addr_str:string = data.address1 + ", " + data.city + ", " + data.province
            mp.respond(addr_str).then((res:any) => {
                // console.log(res[0].geometry.location);
                data.latitude = res[0].geometry.location.lat;
                data.longitude = res[0].geometry.location.lng;
                resolve(data);
            })
        })
    }
}
