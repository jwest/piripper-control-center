#!/usr/bin/env node
const argv = require('yargs').argv
const app = require('../app');

app(argv);