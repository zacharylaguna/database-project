const express = require('express');
const app = express();
const cors = require("cors");
const pool = require("./db");

app.use(cors());
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());


// send requests to http://localhost:4000/<extension>

// test connection
app.get('/test-connection', (req, res, next) => {
    pool.connect(function (err, client, done) {
        if (err) {
            console.log("Can not connect to the DB" + err);
        }
        console.log("connected to the DB");
        res.send("connected to the DB");
    })
});

// test post request
app.post("/test-post", async (req, res) => {
    try {
        console.log(req.body)
        res.send("Hello world!");
    } catch (err) {
        console.error(err.message);
    }
});

app.get("/get-accounts", async (req, res) => {
    try {
        const allAccounts = await pool.query("SELECT * FROM accounts");
        res.json(allAccounts.rows);
    } catch (err) {
        console.error(err.message);
    }
});

// add CRUD here
/**
 * 
 * Get a list of all properties
 * 
 * Example:
 * Send GET request to http://localhost:4000/get-properties/<manager username>.
 * The response will be an array of objects. Each index represents a different tenant.
 * Some attributes are omitted from the response.
 * 
 * attributes
 * property.street, property.city, property.state, property.zip, accounts.name, tenant.username
 */
app.get("/get-properties/:username", async (req, res) => {
    try {
        // username = req.body.username;
        // console.log(username);
        const { username } = req.params;
        // username = 'inewton';
        const allProperties = await pool.query("SELECT property.street, property.city, property.state, property.zip, accounts.name, tenant.username FROM property INNER JOIN tenant ON tenant.tenant_id = property.tenant_id INNER JOIN accounts ON tenant.username = accounts.username WHERE property.manager_id = (SELECT manager.manager_id FROM manager WHERE username = '"+ username +"')");
        res.json(allProperties.rows);
    } catch (err) {
        console.error(err.message);
    }
});


/**
 * 
 * Get a list of all tenants
 * 
 * Example:
 * Send GET request to http://localhost:4000/get-tenants.
 * The response will be an array of objects. Each index represents a different tenant.
 * Some attributes, like the password, are omitted from the response.
 * 
 */
app.get("/get-tenants", async (req, res) => {
    try {
        const allTenants = await pool.query("SELECT tenant_id, accounts.username, newest_payment_id, name, phone FROM tenant JOIN accounts ON tenant.username = accounts.username");
        res.json(allTenants.rows);
    } catch (err) {
        console.error(err.message);
    }
});


/**
 * 
 * Create a new tenant
 * Provide username, password, name, phone in request body.
 * 
 * Example:
 * Send POST request to http://localhost:4000/make-tenant with body:
 * {
 *   "username": "jimmy",
 *   "password": "1234",
 *   "name": "Jimmy",
 *   "phone": "123-456-7890"
 * }
 * 
 */
app.post("/make-tenant", async (req, res) => {
    try {
        const { username, password, name, phone } = req.body;
        const newTodo1 = await pool.query("INSERT INTO accounts VALUES ($1, $2, 'tenant', $3, $4) RETURNING *", [username, password, name, phone]);
        const newTodo2 = await pool.query("INSERT INTO tenant (username) VALUES ($1) RETURNING *", [username]);
        res.json([newTodo1.rows[0], newTodo2.rows[0]]);
    } catch (err) {
        console.error(err.message);
    }
});


/**
 * 
 * Read a tenant's details
 * Provide tenant's username as a parameter.
 * 
 * Example:
 * Send GET request to http://localhost:4000/get-tenant/jimmy.
 * The response will be an object with attributes of the tenant.
 * 
 */
app.get("/get-tenant/:username", async (req, res) => {
    try {
        const { username } = req.params;
        const tenant = await pool.query("SELECT tenant_id, accounts.username, name, phone, newest_payment_id FROM tenant JOIN accounts ON tenant.username = accounts.username WHERE tenant.username = $1", [username]);
        const tenantId = tenant.rows[0].tenant_id;
        const property = await pool.query("SELECT * FROM property JOIN tenant ON tenant.tenant_id = property.tenant_id WHERE tenant.tenant_id = $1", [tenantId]);
        res.json([tenant.rows[0], property.rows[0]]);
    } catch (err) {
        console.log(err.message);
    }
});


/**
 * 
 * Update a tenant's latest payment
 * Provide tenant_id and payment_id to update in the request body.
 * 
 * Example:
 * Send POST request to http://localhost:4000/update-tenant-latest-payment with body:
 * {
 *   "tenant_id": 4,
 *   "payment_id": 32
 * }
 * 
 */
app.post("/update-tenant-latest-payment", async (req, res) => {
    try {
        const { tenant_id, payment_id } = req.body;
        const updatedTenant = await pool.query("UPDATE tenant SET newest_payment_id=$2 WHERE tenant_id=$1 RETURNING *", [tenant_id, payment_id]);
        res.json(updatedTenant.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});


/**
 * 
 * Delete a tenant
 * Provide tenant's username in request body.
 * 
 * Example:
 * Send DELETE request to http://localhost:4000/delete-tenant with body:
 * {
 * "username": "jimmy"
 * }
 * 
 */
app.delete("/delete-tenant", async (req, res) => {
    try {
        const { username } = req.body;
        const deleteTenant = await pool.query("DELETE FROM tenant WHERE username = $1", [username]);
        const deleteAccount = await pool.query("DELETE FROM accounts WHERE username = $1", [username]);
        res.json("Tenant was deleted.");
    } catch (err) {
        console.log(err.message);
    }
});


//////////
app.get("/get-maintenance", async (req, res) => {
    try {
        const allTodos = await pool.query("SELECT * FROM maintenance ORDER BY maintenance_id");
        res.json(allTodos.rows);
    } catch (err) {
        console.error(err.message);
    }
});


app.get("/update-date", async (req, res) => {
    try {
		let param_id = req.query.curr_id
        const allTodos = await pool.query("UPDATE maintenance SET date_completed = NOW() WHERE maintenance_id = " + param_id + " AND date_completed = '1980-01-01'");
        res.json(allTodos.rows);
    } catch (err) {
        console.error(err.message);
    }
});
/////////

// Given username and password return login token
app.get('/login/:username/:password', async (req, res) => {

    try {
        const { username,password } = req.params;
        const pwds = await pool.query("SELECT password FROM accounts WHERE username = '"+ username + "'");
        //pwd = JSON.parse(pwds)
        pwd = pwds.rows[0].password;
        if( pwd == password ){
            res.json({ "token": username });
        }
    } catch (err) {
        console.log("error in get /login: " + err.message);
        res.json({"token": "invalid qq"});
    }
    /*
    res.send({
        token: 'test123'
    });
    */
});

app.listen(4000, function () {
    console.log('Server is running on port 4000');
});
