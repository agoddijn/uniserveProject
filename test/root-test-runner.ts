require('dotenv').config({path: '../.env'});


import * as Mocha from "mocha";
import * as fs from "fs";
import * as path from "path";

// Instantiate a Mocha instance.

const args = process.argv.slice(2);

let directories = [];

let fastUnitTests = require("./config/fast_tests.json");
let slowUnitTests = require("./config/slow_tests.json");

fastUnitTests = fastUnitTests.map(directory =>  path.join(__dirname, "../", directory));
slowUnitTests = slowUnitTests.map(directory =>  path.join(__dirname, "../", directory));

let timeout = 10000;
let slow = 1000;

switch(args[0]){
    case "fast":
        directories = directories.concat(fastUnitTests);
        timeout = 2000;
        slow = 1000;
        break;
    case "all":
        directories = directories.concat(fastUnitTests, slowUnitTests);
        timeout = 30000;
        slow = 10000;        
        break;
    default:
        throw new Error("test-runner requires 1 argument fast or all");
}

const mocha = new Mocha({
    "ui":           "bdd",
    "reporter":     "List",
    "timeout":      timeout,
    "slow":         slow
});

for(let directory of directories){
    try{
        fs.readdirSync(directory).filter(function (file) {
            // Only keep the .js files
            return file.substr(-3) === '.js';
        }).forEach(function (file) {
            mocha.addFile(
                path.join(directory, file)
            );
        });
    } catch (e) {
        console.log("test-runner.ts::Error couldn't open directory: " + directory);
    }

}

// Run the tests.
mocha.run(function (failures) {
    process.on('exit', function () {
        process.exit(failures);  // exit with non-zero status if there were failures
    });
});