import {expect} from 'chai';
import {assert} from 'chai';
import {describe, it, before} from 'mocha';

import {Company} from "uniserve.m8s.types";
import {Device} from "uniserve.m8s.types";

import { DataFaker } from '../DataFaker';


describe('dataFakerTest', function() {
    const dataFaker = new DataFaker();
    let file = dataFaker.json;

    before(function (done) {
        //
    });

    it("test addDataSet", function() {
    dataFaker.addDataSet(file);
    console.log(file);
    });
});