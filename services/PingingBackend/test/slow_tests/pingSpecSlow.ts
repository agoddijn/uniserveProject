import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import Pinger from '../../src/Pinger';
import PingStorage from '../../src/PingStorage';
import {DbInterface} from 'uniserve.m8s.utils';

var expect = chai.expect;
chai.use(sinonChai);

describe("Pinger spec slow", () => {

    before(() => {
        console.log('Before: pingSpecSlow');
        
        // DbInterface stub
        this.dbIntStub = sinon.stub(DbInterface.prototype, 'getAllDevices').callsFake(() => {
            return new Promise((fulfill, reject) => {
                var devices = require('../data/testDevices');
                fulfill(devices);
            });
        });

        this.pinger = new Pinger();
    })

    after(() => {
        console.log('After: pingSpecSlow');

        this.dbIntStub.restore();
    })

    it("Should ping a device with two attempts", (done) => {
        var fakeDevices = require('../data/testDevices');
        this.pinger.ping(fakeDevices[0])
        .then((pingResponse) => {
            expect(pingResponse.device).to.deep.equal(fakeDevices[0]);
            expect(pingResponse.alive).to.be.a('boolean');

            done();
        })
        .catch((e) => {
            done(e);
        })
    })

})