import * as chai from 'chai';
import {Geocoder} from '../../src/geocoding/Geocoder';
import {Site} from 'uniserve.m8s.types';
const expect = chai.expect;



describe("WebBackend::Geocoder.ts spec", function () {

    it("Gets lat/long for a valid address", function (done) {
        const geocoder = new Geocoder();
        const validSite = <Site> {address1:"2329 West Mall", city:"Vancouver", province:"BC", postal_code: "V6T 1Z4"};

        geocoder.geocode(validSite)
            .then(coordinates => {
                expect(coordinates.lat).to.not.equal("");
                expect(coordinates.lat).to.not.equal(Geocoder.FAIL_CODE);
                done();
            })
            .catch(e =>{
                expect.fail();
                done();
            })
        
    })
    
    it("Fails lat/long for a invalid address", function (done) {
        const geocoder = new Geocoder();
        const invalidSite = <Site> {address1:"dasdasdasdasl", city:"Vancouver", province:"BC", postal_code: "V6T 1Z4"};

        geocoder.geocode(invalidSite)
            .then(coordinates => {
                expect(coordinates.lat).to.equal(Geocoder.FAIL_CODE);
                done();
            })
            .catch(e =>{
                expect.fail();
                done();
            })
        
    })
});