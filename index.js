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

const convertQueryToSql = (columnField, valueField) => {
    return ` ${columnField} LIKE '${valueField}%'`;
};

const getQueryParams = (queryJson) => {
    let sqlQueryParams = '';
    queryParams = Object.getOwnPropertyNames(queryJson);
    queryValues = Object.values(queryJson);
    for(i = 0; i < queryParams.length; i++){
        if(i == 0) sqlQueryParams = convertQueryToSql(queryParams[i], queryValues[i]);
        else sqlQueryParams += ' AND' + convertQueryToSql(queryParams[i], queryValues[i]);
    }
    return sqlQueryParams;
};

app.get('/cars', (rq, rs) => {
    const qr = `SELECT * FROM cars WHERE` + getQueryParams(rq.query) + ';'
    console.log(`query --->  ${qr}`);
    client.query(qr, (err, res) => {
        if (err) throw err;
        rs.send(res.rows);
    });
});

app.use((req, res) => {
    res.status(404);
    res.send('<h1>Error 404. \n Page not found!</h1>');
});