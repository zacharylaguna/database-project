const express   = require('express');
const app       = express();
const cors      = require("cors");
const pool      = require("./db");

app.use(cors());
app.use(express.json()); //req.body


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
        const allTodos = await pool.query("SELECT * FROM accounts");
        res.json(allTodos.rows);
    } catch (err) {
        console.error(err.message);
    }
});

// add CRUD here
 
app.listen(4000, function () {
    console.log('Server is running on port 4000');
});
 