// Initialization of dependencies
const express = require('express');
const _ = require('lodash');
const dotenv = require('dotenv')
const { Client } = require('pg');


// Express App initialization
const app = express();
const {log} = console;
dotenv.config();
const client = new Client({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
});
client.connect((err) => {
    if(err) console.log(err);
    else console.log('Database connected');
});

// index.js constants
const HOST = 'localhost';
const PORT = 3000;



app.listen(PORT, HOST, () => {
    log(`Server is listening on http://${HOST}:${PORT}/ \n\t Ready for connections!`);
});

app.get('/', (rq, rs) => {
    client.query('SELECT car_model, price FROM cars;', (err, res) => {
        const result = res;
        rs.send(res);
    });
});

app.use((req, res) => {
    res.status(404);
    res.send('<h1>Error 404. \n Page not found!</h1>');
});