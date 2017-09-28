import * as tcpPing from 'tcp-ping';


tcpPing.ping({address: '216.58.193.78'}, (err, data) => {
    console.log("pinnged" + err + JSON.stringify(data) );
});

setInterval(()=>{
    console.log("starting ping");
    tcpPing.ping({address: '216.58.193.78'}, (err, data) => {
        console.log("pinnged" + err + JSON.stringify(data) );
    });
}, 10000);