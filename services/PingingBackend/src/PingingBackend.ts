import Pinger from './Pinger';

var pinger: Pinger = new Pinger();

setInterval(() => {
    pinger.doPing();
}, 10000);