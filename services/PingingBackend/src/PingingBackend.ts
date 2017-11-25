import Pinger from './Pinger';

var pinger: Pinger = new Pinger();
// interval 1min, newDevs 12Hr
let count = 0;

const tm = {
    interval: +process.env.PING_INTERVAL,
    newDevs: +process.env.PING_NEWDEVS
}

setInterval(() => {
    count ++;
    pinger.doPing()
    .then(success => {
        if (success) console.log("Successful ping");
        else console.log("Error, unsuccessful ping");
    })
    if (count == Math.floor(tm.newDevs / tm.interval)) {
        count = 0;
        pinger.updateDevices();
    }
}, tm.interval);