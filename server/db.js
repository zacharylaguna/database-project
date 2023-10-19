const Pool = require("pg").Pool;

const pool = new Pool({
    host     : 'dev-database.cfa8nnooilud.us-east-2.rds.amazonaws.com',
    user     : 'postgres',
    password : 'devpass09222023',
    port     : '5432',
    database : "real-mgmt"
});

module.exports = pool;