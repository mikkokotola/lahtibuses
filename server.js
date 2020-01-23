// load up the express framework and body-parser helper
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv').config();
const busDataFetcher = require('./fetcher/fetcher.js');

const busDataFetchInterval = parseInt(process.env.BUSDATAFETCHINTERVAL);
const port = parseInt(process.env.PORT);

const app = express();
app.use(cors());

app.use(express.static('public'))

// File system helper library
const fs = require('fs');

// Configure express instance with some body-parser settings 
// including handling JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const routes = require('./routes/busRoutes.js')(app, fs);

// Launch server on port 3001.
const server = app.listen(port, () => {
    console.log('listening on port %s...', server.address().port);
});

// Start bus data fetcher
setInterval(busDataFetcher.fetchBusData.bind(null, fs), busDataFetchInterval);