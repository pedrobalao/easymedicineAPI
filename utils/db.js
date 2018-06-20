const mysql = require('mysql2');
const secrets = require('../config/secrets');

const pool = mysql.createPool(secrets.db.config);

module.exports = pool;
