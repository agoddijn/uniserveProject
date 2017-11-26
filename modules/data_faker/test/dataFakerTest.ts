import * as chai from 'chai';
import * as mocha from 'mocha';
import {Company} from "uniserve.m8s.types";
import {Device} from "uniserve.m8s.types";
import { DataFaker } from '../DataFaker';
import { exec } from 'child_process';
import { PingRecord } from '../../common_types/types/PingRecord';
var assert = require('assert');

describe('dataFakerTest', function() {
    console.log("Entering Data Faker Test")
    
    let expect = chai.expect;
    const dataFaker = new DataFaker();
    let file = dataFaker.webLinksJSONFile;

    beforeEach(function () {
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
        date.setFullYear(2017, 11, 11);
        date.setHours(3, 25, 50);
        
        let generatedPingR = dataFaker.generatePingRecords(numDevices, date);
        expect(generatedPingR.length).to.equal(numDevices);
    });

    it("test: generateDeviceList", function() {
        let devices: Device[] = [];
        let links = dataFaker.links;

        devices = dataFaker.generateDeviceList(links);
        expect(devices.length).to.equal(10000);
    });

    it("test: generateCompanies", function() {
        let companies: Company[] = [];
        let howMany = 5;

        companies = dataFaker.generateCompanies(howMany);
        expect(companies.length).to.equal(5);
    })

});