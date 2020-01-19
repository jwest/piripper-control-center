#!/usr/bin/env node
const argv = require('yargs').argv
const app = require('../app');

async function run() {
    while(true) {
        await app(argv);
    }
}

run();