import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import Pinger from '../src/Pinger';
import PingStorage from '../src/PingStorage';
import {DbInterface} from 'uniserve.m8s.utils';

var expect = chai.expect;
chai.use(sinonChai);

describe("PingStorage spec", () => {

    before(() => {
        console.log('Before: pingStorageSpec');
        
        // DbInterface stub
        this.DbIntStub = sinon.stub(DbInterface.prototype, 'storePingRecords');

        this.DbIntStub.onCall(0).callsFake((date, records) => {
            return new Promise((fulfill, reject) => {
                fulfill([date, true]);
            });
        });

        this.DbIntStub.callsFake((date, records) => {
            return new Promise((fulfill, reject) => {
                fulfill([date, false]);
            });
        });

        this.storage = new PingStorage();
        this.date1 = new Date();
    })

    after(() => {
        console.log('After: pingStorageSpec');
    })

    it("Should add ping records", (done) => {
        var fakeRecords = require('./data/testPingRecords');

        this.storage.addPingRecords(this.date1, fakeRecords);

        expect(this.storage.pingMap.size).to.equal(1);
        expect(this.storage.pingMap.get(this.date1.getTime()).length).to.equal(fakeRecords.length);

        done();
    })

    it("should not add the same date twice", (done) => {
        var fakeRecords = require('./data/testPingRecords');
        
        this.storage.addPingRecords(this.date1, fakeRecords);

        expect(this.storage.pingMap.size).to.equal(1);
        expect(this.storage.pingMap.get(this.date1.getTime()).length).to.equal(fakeRecords.length);

        done();
    })

    it("Should attempt to store records in backend and remove them from map if the attempt succeeds", (done) => {
        this.storage.sendRecords();

        setTimeout(() => {
            expect(this.DbIntStub.called).to.be.true;
            expect(this.storage.pingMap.size).to.equal(0);
            
            done();
        }, 1000);
        


    })

    it("Should keep records if they cannot be sent", (done) => {
        var date = new Date();
        var date2 = new Date(date.getTime() + 10000);
        var fakeRecords = require('./data/testPingRecords');

        this.storage.addPingRecords(date, fakeRecords);
        this.storage.addPingRecords(date2, fakeRecords);

        expect(this.storage.pingMap.size).to.equal(2);

        this.storage.sendRecords();

        setTimeout(() => {
            expect(this.DbIntStub.called).to.be.true;
            expect(this.storage.pingMap.size).to.equal(2);
            
            done();
        }, 1000);
    })

})