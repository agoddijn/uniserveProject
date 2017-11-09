import Pinger from './Pinger';

var pinger: Pinger = new Pinger();

setInterval(() => {
    pinger.doPing()
    .then(success => {
        if (success) console.log("Successful ping");
        else console.log("Error, unsuccessful ping");
    })
}, 10000);