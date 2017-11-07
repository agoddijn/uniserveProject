// var client = require('@google/maps').createClient({
//     key: 'AIzaSyBPUUMxqRaHjBgeaedmPmBHBjWfmEFihiw'
//   });

class MapClient{
    client:any;
    constructor(){
        this.client = require('@google/maps').createClient({
            key: 'AIzaSyBPUUMxqRaHjBgeaedmPmBHBjWfmEFihiw'
          });
    }
    //async
    respond(addr:string):Promise<any>{
        return new Promise<any>((resolve:any) => {
            this.client.geocode({
                address: addr
              }, function(err:any, response:any) {
                  if(!err){
                    resolve(response.json.results);
                  }
              });
        })
        
    }
}
export let mp = new MapClient();
