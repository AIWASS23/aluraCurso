require('dotenv').config()

const app = require('./app');
const port = 3000;
const db = require('./database');
require('./redis/blacklist');

const routes = require('./rotas');
routes(app);

app.listen(port, () => console.log(`App listening on port ${port}`));

/*

Modulo ES

require('dotenv').config()

import app, { listen } from './app';
const port = 3000;
import db from './database';
import './redis/blacklist';

import routes from './rotas';
routes(app);

listen(port, () => console.log(`App listening on port ${port}`));

*/