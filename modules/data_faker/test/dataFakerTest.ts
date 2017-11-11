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
        let numDevices = 1000;
        let returnedDevices = [];

        returnedDevices = dataFaker.getDevices(numDevices);

        expect(returnedDevices.length).to.equal(1000);
    });

    it("test: generatePingRecords", function() {
        let numDevices = 500;
        let date: Date = new Date();
        
        
        //let generatedPingR = dataFaker.generatePingRecords(numDevices, date.);
    });

    it("test: generateDeviceList", function() {
        let devices = [];
        let links = dataFaker.links;

        devices = dataFaker.generateDeviceList(links);
        expect(devices.length).to.equal(10000);
    });

});