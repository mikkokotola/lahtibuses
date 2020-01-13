var fetchBusData = require('./fetchBusData.js')

const fs = require('fs');

setInterval(fetchBusData.bind(null, fs), 5000);