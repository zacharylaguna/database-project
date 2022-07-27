const Pool = require("pg").Pool;

const pool = new Pool({
    host     : 'real-mgmt-1.cluster-cfa8nnooilud.us-east-2.rds.amazonaws.com',
    user     : 'postgres',
    password : 'OsRwuPYJC0jsj0TnGNur',
    port     : '5432',
    database : "real-mgmt-db"
});

module.exports = pool;