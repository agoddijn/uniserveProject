import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import * as Authenticator from '../../src/auth/Authenticator';
import { mockReq, mockRes } from 'sinon-express-mock';


const expect = chai.expect;
chai.use(sinonChai);


describe("WebBackend::auth/Authenticator.ts spec", function () {

    it("Properly Authenticate with correct env", function (done) {
        process.env.PHP_AUTH_TOKEN = "12345"

        const request = {
            query: {
                authtoken: process.env.PHP_AUTH_TOKEN
            }
        }

        const req = mockReq(request);
        const res = mockRes();
        res.send = sinon.spy();

        const next = function(){
            done();
        }

        Authenticator.authenticate(req, res, next);
        expect(res.send).not.to.have.been.called;
        
    })
    
});