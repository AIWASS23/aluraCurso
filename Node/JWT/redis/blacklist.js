const redis = require('redis');
module.exports = redis.createClient({ prefix: 'blacklist:' });

/*

módulo ES

import { createClient } from 'redis';
export default createClient({ prefix: 'blacklist:' });
*/