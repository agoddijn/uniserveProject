import * as chai from 'chai';
import * as mocha from 'mocha';
import {Company} from "uniserve.m8s.types";
import {Device} from "uniserve.m8s.types";
import { DataFaker } from '../DataFaker';


describe('dataFakerTest', function() {
    console.log("Entering Data Faker Test")
    
    let expect = chai.expect;
    const dataFaker = new DataFaker();
    let file = dataFaker.json;

    before(function (done) {
        dataFaker.addDataSet(file);
    });

    it("test addDataSet", function() {
    console.log(file);
    expect(dataFaker.links.length).to.equal(10000);
    });

    it("test: getDevices", function() {
        
    });

    it("test: generatePingRecords", function() {

    });

    it("test: generateDeviceList", function() {
        
    });

});