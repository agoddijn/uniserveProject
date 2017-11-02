import * as chai from 'chai';
import Pinger from '../../src/Pinger';
import {DataFaker} from 'uniserve.m8s.data_faker';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import PingStorage from '../../src/PingStorage';
import {DbInterface} from 'uniserve.m8s.utils';
import {Device} from 'uniserve.m8s.types';

var expect = chai.expect;
chai.use(sinonChai);

describe("Pinger performance test", () => {

    var iters = 10;
    function increment(i) {
        return 100*i;
    }
    
    before(() => {
        console.log('Before: pingPerformanceTest');
        this.dataFaker = new DataFaker();

        this.orders = iters;
        var that = this;

        sinon.addBehavior("returnIter", (fake,i) => {
            fake.resolves(that.dataFaker.getTopDevices(increment(i)));
        })

        this.dbStub = sinon.stub(DbInterface.prototype, 'getAllDevices');
        for (var i = 0; i <= iters + 1; i++) {
            this.dbStub.onCall(i).returnIter(i);
        }

        this.storageSpy = sinon.spy(PingStorage.prototype, 'addPingRecords');

        this.dbStoreStub = sinon.stub(DbInterface.prototype, 'storePingRecords');
        this.dbStoreStub.callsFake((date, records) => {
            return new Promise((fulfill, reject) => {
                fulfill([date, true]);
            });
        })

        this.pinger = new Pinger();
    })

    after(() => {
        console.log('After: pingPerformanceTest');
        this.dbStub.restore();
        this.storageSpy.restore();
        this.dbStoreStub.restore();
    })

    function doTest(i, that) {
        it("Pinging " + String(increment(i+1)) + " device(s)", (done) => {
            that.pinger.updateDevices();
            setTimeout(() => {
                that.pinger.doPing()
                .then(success => {
                    expect(success).to.be.true;
                    var storageCall = that.storageSpy.getCall(i);
                    expect(storageCall.args[1].length).to.equal(increment(i+1));
                    expect(that.dbStoreStub.called).to.be.true;
                    that.dbStoreStub.resetHistory();
                    done();
                })
                .catch((e) => {
                    done(e);
                })
            }, 1000);
        })
    }

    for (var i = 0; i <= iters; i++) {
        doTest(i, this);
    }

})

