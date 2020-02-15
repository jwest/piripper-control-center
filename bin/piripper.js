#!/usr/bin/env node
const { argv } = require('yargs');
const app = require('../dist/app');

async function run() {
  while (true) { // eslint-disable-line no-constant-condition
    await app.default(argv); // eslint-disable-line no-await-in-loop
  }
}

run();
