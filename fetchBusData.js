var GtfsRealtimeBindings = require('gtfs-realtime-bindings');
var request = require('request');
var username = 'ENTER_YOUR_WALTTI_CLIENT_ID_HERE'
var password = 'ENTER_YOUR_WALTTI_CLIENT_SECRET_HERE'

const dataPath = './data/buses.json';

function fetchBusData(fs) {
  console.log('Within fetchBusData')
  var requestSettings = {
    method: 'GET',
    url: 'https://' + username + ':' + password + '@data.waltti.fi/lahti/api/gtfsrealtime/v1.0/feed/vehicleposition',
    encoding: null    
  };
  request(requestSettings, function (error, response, body) {
    console.log('Got response from API. Status code: ' + response.statusCode);
    
    if (!error && response.statusCode == 200) {
      var feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(body);
      var buses = []
      feed.entity.forEach(function(entity) {
        buses.push(entity)
      });
  
      // Write to JSON file
      var data = JSON.stringify(buses);
      fs.writeFileSync(dataPath, data);
    }
  });
  console.log('Leaving fetchBusData')
}

module.exports = fetchBusData;
