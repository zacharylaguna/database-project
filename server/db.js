const Pool = require("pg").Pool;

const pool = new Pool({
    host     : 'real-mgmt-pg-1.cfa8nnooilud.us-east-2.rds.amazonaws.com',
    user     : 'postgres',
    password : 'sUbQBVBol5sI23zGQwHt',
    port     : '5432',
    database : "real-mgmt"
});

module.exports = pool;