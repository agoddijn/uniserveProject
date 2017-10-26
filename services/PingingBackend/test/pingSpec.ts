import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import Pinger from '../src/Pinger';
import PingStorage from '../src/PingStorage';
import {DbInterface} from 'uniserve.m8s.utils';

var expect = chai.expect;
chai.use(sinonChai);

describe("Pinger spec", () => {

    before(() => {
        console.log('Before: pingSpec');
        
        // DbInterface stub
        sinon.stub(DbInterface.prototype, 'getAllDevices').callsFake(() => {
            return new Promise((fulfill, reject) => {
                var devices = require('./data/testDevices');
                fulfill(devices);
            });
        });

        this.pinger = new Pinger();
    })

    after(() => {
        console.log('After: pingSpec');
    })

    it("Should attempt to load data from database", (done) => {
        var fakeDevices = require('./data/testDevices');
        expect(this.pinger.devices).to.deep.equal(fakeDevices);

        done();
    })

    it("Should correctly convert a valid ping response", (done) => {
        let validResponse = require('./data/validPingResponse');
        let converted = this.pinger.responseToRecord(validResponse);

        expect(converted.ping_recid).to.be.a('null');
        expect(converted.device_recid).to.equal(validResponse.device.device_recid);
        expect(converted.ms_response).to.equal(validResponse.avg);
        expect(converted.responded).to.be.true;
        expect((converted.datetime).getTime()).to.be.lte((new Date()).getTime());
        expect(converted.ip_address).to.equal(validResponse.device.ip_address);

        done();
    })

    it("Should correctly convert an invalid ping response", (done) => {
        let invalidResponse = require('./data/invalidPingResponse');
        let converted = this.pinger.responseToRecord(invalidResponse);
        
        expect(converted.ping_recid).to.be.a('null');
        expect(converted.device_recid).to.equal(invalidResponse.device.device_recid);
        expect(converted.ms_response).to.be.a('null');
        expect(converted.responded).to.be.false;
        expect((converted.datetime).getTime()).to.be.lte((new Date()).getTime());
        expect(converted.ip_address).to.equal(invalidResponse.device.ip_address);

        done();
    })

    it("Should ping a device with two attempts", (done) => {
        var fakeDevices = require('./data/testDevices');
        this.pinger.ping(fakeDevices[0])
        .then((pingResponse) => {
            expect(pingResponse.attempts).to.equal(2);
            expect(pingResponse.results).to.be.an('array');
            expect(pingResponse.avg).to.not.be.undefined;

            done();
        })
        .catch((e) => {
            done("Should never error");
        })
    })

})