const express = require('express');
const app = express();
const cors = require("cors");
const pool = require("./db");
const jwt = require('jsonwebtoken');

app.use(cors());
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

const secret_key = "key_is_secret";

function ensureTokenAndUsername(req, username) {
    var isCorrect = false;
    console.log(req.headers);
    jwt.verify(req.headers.token, secret_key, function (err, decode) {
        if (err) {
            console.error("ensureToken error: " + err.message);
        } else {
            isCorrect = decode.username === username;
        }
    });
    return isCorrect;
}

function ensureToken(req) {
    var isCorrect = false;
    console.log(req.headers.token);
    jwt.verify(req.headers.token, secret_key, function (err, decode) {
        if (err) {
            console.error("ensureToken error: " + err.message);
        } else {
            isCorrect = true;
        }
    });
    return isCorrect;
}


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
 */
app.get("/manager/properties/:username", async (req, res) => {
    try {
        // username = req.body.username;
        // console.log(username);
        const { username } = req.params;
        // username = 'inewton';
        const allProperties = await pool.query("SELECT property.street, property.city, property.state, property.zip, accounts.name, tenant.username FROM property INNER JOIN tenant ON tenant.tenant_id = property.tenant_id INNER JOIN accounts ON tenant.username = accounts.username WHERE property.manager_id = (SELECT manager.manager_id FROM manager WHERE username = '" + username + "')");
        res.json(allProperties.rows);
    } catch (err) {
        console.error(err.message);
    }
});

/**
 * 
 * Get recent rent payments for all properties the manager owns
 * 
 */
app.get("/manager/payments/:username", async (req, res) => {
    try {
        // username = req.body.username;
        // console.log(username);
        const { username } = req.params;
        // username = 'inewton';
        const p = await pool.query("SELECT payment.*, accounts.name, accounts.username FROM payment INNER JOIN tenant ON payment.tenant_id = tenant.tenant_id INNER JOIN accounts ON tenant.username = accounts.username WHERE payment.tenant_id IN (SELECT tenant_id FROM property WHERE property.manager_id = (SELECT manager.manager_id FROM manager WHERE username = '" + username + "')) ORDER BY payment.date_paid DESC");
        res.json(p.rows);
    } catch (err) {
        console.error(err.message);
    }
});

/**
 * 
 * add new property
 * 
 */
app.post("/manager/add-property/:manager_username", async (req, res) => {
    try {
        // username = req.body.username;
        // console.log(username);
        const { manager_username } = req.params;
        const { tenant_username, tenant_password, tenant_name, tenant_phone, payment_amount, payment_method, property_street, property_city, property_state, property_zip, property_cost } = req.body;
        // username = 'inewton';
        const p = await pool.query(
            "INSERT INTO accounts (username, password, role, name, phone) VALUES ('" + tenant_username + "', '" + tenant_password + "', 'tenant', '" + tenant_name + "', '" + tenant_phone + "'); INSERT INTO tenant (username, newest_payment_id) VALUES ('" + tenant_username + "', null); INSERT INTO payment (tenant_id, amount, date_paid, payment_method) VALUES ((select tenant.tenant_id from tenant WHERE tenant.username = '" + tenant_username + "'), " + payment_amount + ", NOW(), '" + payment_method + "'); UPDATE tenant SET newest_payment_id = (select payment.payment_id from payment WHERE payment.tenant_id = (select tenant_id from tenant where tenant.username = '" + tenant_username + "')) WHERE tenant.username = '" + tenant_username + "'; INSERT INTO property (street, city, state, zip, tenant_id, manager_id, monthly_cost) VALUES ('" + property_street + "', '" + property_city + "', '" + property_state + "', '" + property_zip + "', (select tenant.tenant_id from tenant WHERE tenant.username = '" + tenant_username + "'), (select manager.manager_id from manager WHERE manager.username = '" + manager_username + "'), " + property_cost + ");"
        );
        res.json('done');
    } catch (err) {
        res.send('error adding property');
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

        // get tenant id
        const tenant = await pool.query("SELECT tenant_id, accounts.username, name, phone, newest_payment_id FROM tenant JOIN accounts ON tenant.username = accounts.username WHERE tenant.username = $1", [username]);
        const tenantId = tenant.rows[0].tenant_id;

        // get information about the tenant's property
        const property = await pool.query("SELECT * FROM property JOIN tenant ON tenant.tenant_id = property.tenant_id WHERE tenant.tenant_id = $1", [tenantId]);

        // get payment history
        const payments = await pool.query("SELECT amount, date_paid, payment_id, payment_method FROM payment JOIN tenant ON tenant.tenant_id = payment.tenant_id WHERE tenant.tenant_id = $1", [tenantId]);;

        res.json([tenant.rows[0], property.rows[0], payments.rows]);
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
app.post("/delete-tenant", async (req, res) => {
    try {
        const { username } = req.body;
        const deleteAccount = await pool.query("DELETE FROM accounts WHERE username = $1", [username]);
        res.json("Tenant was deleted.");
    } catch (err) {
        console.log(err.message);
    }
});

app.get("/get-maintenance", async (req, res) => {
    try {
        const allTodos = await pool.query("SELECT * FROM maintenance ORDER BY maintenance_id");
        res.json(allTodos.rows);
    } catch (err) {
        console.error(err.message);
    }
});


app.get("/outstanding-maintenance", async (req, res) => {
    try {
        const allTodos = await pool.query("SELECT * FROM maintenance WHERE date_completed = '1980-01-01'");
        res.json(allTodos.rows);
    } catch (err) {
        console.error(err.message);
    }
});

app.get("/outstanding-maintenance-properties", async (req, res) => {
    try {
        const allTodos = await pool.query("SELECT DISTINCT property_id FROM maintenance WHERE date_completed = '1980-01-01'");
        res.json(allTodos.rows);
    } catch (err) {
        console.error(err.message);
    }
});

app.get("/priority-maintenance-properties", async (req, res) => {
    try {
        const allTodos = await pool.query("SELECT property_id, COUNT(property_id) AS num_incomplete FROM maintenance WHERE date_completed = '1980-01-01' GROUP BY property_id ORDER BY num_incomplete DESC");
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

app.get("/delete-date", async (req, res) => {
    try {
        let param_id = req.query.curr_id;
        const allTodos = await pool.query("DELETE FROM maintenance WHERE maintenance_id = " + param_id);
        res.json(allTodos.rows);
    } catch (err) {
        console.error(err.message);
    }
});

app.post("/make-request", async (req, res) => {
    try {
        const { contractor_id, property_id, description } = req.body;
        console.log(req.body);
        console.log(req.body);
        const newTodo1 = await pool.query("INSERT INTO maintenance (contractor_id, property_id, description, date_submitted) VALUES ($1, $2, $3, NOW()) RETURNING *", [contractor_id, property_id, description]);
        res.json([newTodo1.rows[0]]);
    } catch (err) {
        res.send('Information entered not correct.')
        console.error(err.message);
    }
});

app.post("/make-contractor", async (req, res) => {
    try {
        const { username, password, name, phone, hourly_rate } = req.body;
        const newTodo1 = await pool.query("INSERT INTO accounts VALUES ($1, $2, 'contractor', $3, $4) RETURNING *", [username, password, name, phone]);
        const newTodo2 = await pool.query("INSERT INTO contractor (username, hourly_rate) VALUES ($1, $2) RETURNING *", [username, hourly_rate]);
        res.json([newTodo1.rows[0], newTodo2.rows[0]]);
    } catch (err) {
        res.send('Information entered not correct.')
        console.error(err.message);
    }
});

/////////
/////////

/// Create new manager
app.post("/make-manager", async (req, res) => {
    try {
        const { username, password, name, phone } = req.body;
        console.log(req.body);
        const newAccount = await pool.query("INSERT INTO accounts VALUES ($1, $2, 'manager', $3, $4) RETURNING *", [username, password, name, phone]);
        const newManager = await pool.query("INSERT INTO manager (username) VALUES ($1) RETURNING *", [username]);
        res.json([newAccount.rows[0], newManager.rows[0]]);
    } catch (err) {
        res.send("unable to register");
        console.error(err.message);
    }
});




// Given username and password return login token
app.get('/login/:username/:password', async (req, res) => {

    try {
        const { username, password } = req.params;
        const pwds = await pool.query("SELECT password, role FROM accounts WHERE username = '" + username + "'");
        pwd = pwds.rows[0].password;
        role = pwds.rows[0].role;
        if (pwd == password) {
            const token = jwt.sign({ username: username, role: role }, secret_key);
            res.json({
                token: token,
                username: username,
                role: role
            });
        } else {
            res.json({
                "token": "invalid"
            })
        }
    } catch (err) {
        console.log("error in get /login: " + err.message);
        res.json({ "token": "invalid" });
    }
});

//TOKEN USE SERVER SIDE EXAMPLE
//Change password
app.get('/change-password/:username/:oldPassword/:newPassword', async (req, res) => {
    try {
        const { username, oldPassword, newPassword } = req.params;
        ////// Check Token
        //Verifies token is valid & verifies username is correct
        if (!ensureTokenAndUsername(req, username)) {
            res.sendStatus(403);
            return;
        }
        ///// 
        ///// Go on with normal operations
        const pwds = await pool.query("SELECT password FROM accounts WHERE username = '" + username + "'");
        pwd = pwds.rows[0].password;
        if (pwd === oldPassword) {
            const updatedTenant = await pool.query("UPDATE accounts SET password = $1 WHERE username = $2 RETURNING *", [newPassword, username]);
            res.send("success");
        } else {
            res.send("incorrect password");
        }

    } catch (err) {
        console.error(err.message);
        res.send("not completed");
    }
});

// test whether user is authenticated
app.get('/test-autho', async (req, res) => {
    try {
        console.log(req.headers.token)
        jwt.verify(req.headers.token, secret_key, function (err, decoded) {
            if (err) {
                console.log(err.message);
                res.sendStatus(403);
            } else {
                res.json({
                    text: "Access granted",
                    data: decoded
                })
            }
        });

    } catch (err) {
        console.log("error in /test-autho: " + err.message);
    }
});

app.listen(4000, function () {
    console.log('Server is running on port 4000');
});
