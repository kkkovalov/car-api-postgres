// Initialization of dependencies
const express = require('express');
const _ = require('lodash');

// Express App initialization
const app = express();
const {log} = console;

// index.js constants
const HOST = 'localhost';
const PORT = 3000;

app.listen(PORT, HOST, () => {
    log(`Server is listening on http://${HOST}:${PORT}/ \n\t Ready for connections!`);
});

app.use((req, res) => {
    res.status(404);
    res.send('<h1>Error 404. \n Page not found!</h1>');
});