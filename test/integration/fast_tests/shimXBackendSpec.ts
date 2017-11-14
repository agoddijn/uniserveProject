require('dotenv').config({path: '../.env'});
import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import { mockReq, mockRes } from 'sinon-express-mock';
import chaiHttp = require('chai-http');

const expect = chai.expect;
chai.use(sinonChai);
chai.use(chaiHttp);

import * as webserver from '../../../services/WebBackend/src/WebBackend';
import * as phpshim from '../../../modules/php_shim/php_shim';


describe("WebBackendXPHP_Shim Spec", function () {
    let web;

    before(function(){
        web = chai.request.agent(webserver);
    });

    it("Logs in", function (done) {
        chai.request(phpshim)
        .post('/login')
        .send({company_recid: 1000})
        .end((err, res) => {
            expect(res).to.have.status(200);
            done();            
        })
    })

    it("Logs in and get devices", function (done) {
        const agent = chai.request.agent(phpshim);

        agent
        .post('/login')
        .send({company_recid: 1000})
        .then( res => {
            expect(res).to.have.status(200);
            expect(res).to.have.cookie("SHIM_SESSION");

            return agent.get('/ajax/monitoring_api.php?type=devices');
        })
        .then( res => {
            expect(res).to.have.status(200);     
            done();       
        })
    })  
    
    
});