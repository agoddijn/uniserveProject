require('dotenv').config({path: '../.env'});
import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import { mockReq, mockRes } from 'sinon-express-mock';
import chaiHttp = require('chai-http');


const properENV = process.env;
const expect = chai.expect;
chai.use(sinonChai);
chai.use(chaiHttp);

import * as webserver from '../../src/WebBackend';

describe("WebBackend Spec", function () {
    beforeEach(function(){
        //reset to valid enviroment
        process.env = properENV;
    })

    it("Valid Company ID Returns Results", function (done) {
        
        chai.request(webserver)
        .get(`/api/company/1000/devices?authtoken=${process.env.PHP_AUTH_TOKEN}`)
        .end(function (err, res) {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            done();            
        })
    })

    it("Invalid Company ID should returns error", function (done) {     
        chai.request(webserver)
        .get(`/api/company/4/devices?authtoken=${process.env.PHP_AUTH_TOKEN}`)
        .end(function (err, res) {
            expect(res).to.have.status(400);
            done();            
        })
    })

    it("Invalid Auth Token should reject", function (done) {     
        chai.request(webserver)
        .get(`/api/company/1000/devices?authtoken=323232`)
        .end(function (err, res) {
            expect(res).to.have.status(400);
            done();            
        })
    })

    it("Response Format is Correct", function (done) {     
        chai.request(webserver)
        .get(`/api/company/1000/devices?authtoken=${process.env.PHP_AUTH_TOKEN}`)
        .end(function (err, res) {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            let record = res.body[0];
            expect(record.devices).to.be.an('array');
            done();            
        })
    })
    
});

