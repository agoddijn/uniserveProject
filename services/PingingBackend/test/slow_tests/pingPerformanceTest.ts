import * as chai from 'chai';
import Pinger from '../../src/Pinger';
import {DataFaker} from 'uniserve.m8s.data_faker';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import PingStorage from '../../src/PingStorage';
import {DbInterface} from 'uniserve.m8s.utils';

var expect = chai.expect;
chai.use(sinonChai);

var orders = 2;

describe("Pinger performance test", () => {
    
    before(() => {
        console.log('Before: pingPerformanceTest');
        this.dataFaker = new DataFaker();

        this.orders = orders;

        this.dbStub = sinon.stub(DbInterface.prototype, 'getAllDevices');
        for (var i = 0; i <= this.orders; i++) {
            this.dbStub.onCall(i).resolves(this.dataFaker.getTopDevices(Math.pow(10,i)));
        }

        this.storageSpy = sinon.spy(PingStorage.prototype, 'addPingRecords');

        this.pinger = new Pinger();
    })

    after(() => {
        console.log('After: pingPerformanceTest');
        this.dbStub.restore();
        this.storageSpy.restore();
    })

    function itShouldPing(i, that) {
        it("Pinging " + String(Math.pow(10,i)) + " devices", (done) => {
            that.pinger.doPing()
            .then(success => {
                expect(success).to.be.true;

                var storageCall = that.storageSpy.getCall(i);
                expect(storageCall.args[1].length).to.equal(Math.pow(10,i));

                that.pinger.updateDevices();
    
                done();
            })
            .catch((e) => {
                that.pinger.updateDevices();
                done(e);
            })
        })
    }

    for (var i = 0; i <= orders; i++) {
        itShouldPing(i,this);
    }
        
    

})

