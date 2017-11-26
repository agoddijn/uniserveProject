import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import {dbObj} from '../../../db_connection/db_connection'
import { DbInterface } from 'uniserve.m8s.web.db_interface';
import { DataFaker } from 'uniserve.m8s.data_faker';

var expect = chai.expect;
chai.use(sinonChai);
var time;
let df = new DataFaker;
let db = dbObj;

describe("Database read", () => {

    before(() => {
        console.log('Before: pingSpec');
        time = Date.now();
        var devices = df.generatePingRecords(10000,time);
        // DbInterface stub
        this.dbStub = sinon.stub(DbInterface.prototype, 'getAllPings').resolves(devices);

    })

    after(() => {
        console.log('After: pingSpec');

        this.dbStub.restore();
    })

    it("Should attempt to load data from database", (done) => {
        var fakeDevices = require('../data/testDevices');
        expect(this.pinger.devices).to.deep.equal(fakeDevices);

        done();
    })

    it("Should correctly convert a valid ping response", (done) => {
        let validResponse = require('../data/validPingResponse');
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
        let invalidResponse = require('../data/invalidPingResponse');
        let converted = this.pinger.responseToRecord(invalidResponse);
        
        expect(converted.ping_recid).to.be.a('null');
        expect(converted.device_recid).to.equal(invalidResponse.device.device_recid);
        expect(converted.ms_response).to.be.a('null');
        expect(converted.responded).to.be.false;
        expect((converted.datetime).getTime()).to.be.lte((new Date()).getTime());
        expect(converted.ip_address).to.equal(invalidResponse.device.ip_address);

        done();
    })

})