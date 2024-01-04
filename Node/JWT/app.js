const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const { estrategiasAutenticacao } = require('./src/usuarios');

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

module.exports = app;

/*

modulo ES

import express from 'express';
const app = express();
import { urlencoded } from 'body-parser';

import { estrategiasAutenticacao } from './src/usuarios';

app.use(
  urlencoded({
    extended: true
  })
);

export default app;

*/
