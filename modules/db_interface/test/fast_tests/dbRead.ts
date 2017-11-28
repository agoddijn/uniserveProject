import {Company, Site, Device, PingRecord} from 'uniserve.m8s.types'
import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import { DbInterface } from 'uniserve.m8s.web.db_interface';
import { DataFaker } from 'uniserve.m8s.data_faker';
import { DbTesting } from 'uniserve.m8s.utils'

var expect = chai.expect;
chai.use(sinonChai);
var time;
let df = new DataFaker();
let dbInt = new DbInterface(true);
let dbTest = new DbTesting(true);
let pingRecords;

describe("Database read", () => {

    before(() => {
        console.log('Before: pingSpec');
        time = Date.now();
        pingRecords = df.generatePingRecords(10000,time);

    })

    after(() => {
        console.log('After: pingSpec');
        dbInt.deleteRecentRecords();
    })

    it("Should attempt to store 10000 records into the ping table", (done) => {
        dbInt.storePingRecords(time,pingRecords).then(data => {
            expect(data[1]).to.be.true;
            done();
        })
    })


    it("Should attempt to load 10000 records from the ping table", (done) => {
        dbInt.getAllPings().then(data => {
            expect(data.length).to.equal(10000);
            done();
        })
    })
})