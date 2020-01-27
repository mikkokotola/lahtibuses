// load up the express framework and body-parser helper
const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv').config();
const fs = require('fs');
require('console-stamp')(console, '[HH:MM:ss.l]');

const busDataFetcher = require('./fetcher/fetcher.js');
const port = parseInt(process.env.PORT);

const app = express();
app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const routes = require('./routes/busRoutes.js')(app);

// Launch server on port 3001.
const server = https.createServer({
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem'),
    passphrase: 'buses'
}, app).listen(port, () => {
    console.log('listening on port %s...', server.address().port);
});