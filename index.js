// Initialization of dependencies
const express = require('express');
const _ = require('lodash');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const { Client } = require('pg');


// Express App initialization
const app = express();

const bodyParserUrl = bodyParser.urlencoded({extended: false});

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

// Functions for requests;

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

function updateSqlRequest(patchBody) {
    let returnQuery = '';
    const reqValues = Object.values(patchBody);
    const reqProps = Object.getOwnPropertyNames(patchBody);
    returnQuery = `${reqProps[0]} = '${reqValues[0]}'`;
    for(i = 1; i < reqValues.length; i++){
        returnQuery += `, ${reqProps[i]} = '${reqValues[i]}'`;
    }
    return returnQuery;
};

// GET request for all cars, optional WHERE statement
app.get('/cars', (rq, rs) => {
    const qr = `SELECT * FROM cars WHERE` + getQueryParams(rq.query) + ';'
    console.log('query --->  ', qr);
    client.query(qr, (err, res) => {
        if (err) throw err;
        rs.send(res.rows);
    });
});

// GET request for car by ID
app.get('/cars/:id', (rq, rs) => {
    const qr = `SELECT * FROM cars WHERE id = ${rq.params.id};`;
    client.query(qr, (err, res) => {
        if (err) throw err;
        rs.send(res.rows[0]);
    });
});

//Delete request by ID of the car
app.delete('/cars/:id', (rq, rs) => {
    const qr = `DELETE FROM cars WHERE id = '${rq.params.id}';`
    console.log('query --->  ', qr);
    client.query(qr, (err, res) => {
        if (err) throw err;
        if(res.rowCount == 1) rs.send(`Successfully deleted id = ${rq.params.id}.`);
        else rs.send('Invalid ID, try again.');
    });
});

//Update request by ID of the car
app.patch('/cars/:id', bodyParserUrl, (rq, rs) => {
    const qr = `UPDATE cars SET ` + updateSqlRequest(rq.body) + ` WHERE id = ${rq.params.id};`;
    log(qr);
    client.query(qr, (err, res) => {
        if (err) throw err;
        rs.send(res);
    });
});


// 404 page, or inappropriate url
app.use((req, res) => {
    res.status(404);
    res.send('<h1>Error 404. \n Page not found!</h1>');
});