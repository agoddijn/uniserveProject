import Pinger from './Pinger';

var pinger: Pinger = new Pinger();
// interval 1min, newDevs 12Hr
let count = 0, interval = 60000, newDevs = 4.32e7;

setInterval(() => {
    count ++;
    pinger.doPing()
    .then(success => {
        if (success) console.log("Successful ping");
        else console.log("Error, unsuccessful ping");
    })
    if (count == Math.floor(newDevs / interval)) {
        count = 0;
        pinger.updateDevices();
    }
}, interval);