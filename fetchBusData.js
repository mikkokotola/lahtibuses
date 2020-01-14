var GtfsRealtimeBindings = require('gtfs-realtime-bindings');
var request = require('request');
const fs = require('fs');

const walttiUserName = process.env.WALTTIUSERNAME
const walttiPassword = process.env.WALTTIPASSWORD
const city = process.env.CITY
const datapath = './data/buses.json';
const routeNamepath = './data/routes.txt';
const parse = require('csv-parse/lib/sync')
var routeNames;

function fetchBusData(fs) {
  console.log('Within fetchBusData')
  console.log('Waltti username: ' + walttiUserName)
  console.log('Waltti pw: ' + walttiPassword)
  var requestSettings = {
    method: 'GET',
    url: 'https://' + walttiUserName + ':' + walttiPassword + '@data.waltti.fi/' + city + '/api/gtfsrealtime/v1.0/feed/vehicleposition',
    encoding: null    
  };
  request(requestSettings, function (error, response, body) {
    console.log('Got response from API. Status code: ' + response.statusCode);
    
    if (!error && response.statusCode == 200) {
      var feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(body);
      var buses = [];
      feed.entity.forEach(function(entity) {
        buses.push(entity);
      });
  
      // Write to JSON file
      var data = JSON.stringify(buses);
      fs.writeFileSync(datapath, data);
    }
  });
  console.log('Leaving fetchBusData');
}

function getRouteName(id) {
  if (routeNames === undefined) {
    readRouteNames();    
  }
  
  console.log('Getting route name for id ' + id);
  var ids = String(id);
  if (routeNames[id]){
    console.log('Returning ' + routeNames[id])
    return routeNames[id]    
  } else {
    console.log('Returning noval')
    return '-';
  }
}

function readRouteNames() {
  var routeNameData = fs.readFileSync(routeNamepath, {encoding:'utf8'});
  routeNamesArr = parse(routeNameData, {
    columns: true,    
    skip_empty_lines: true
  });
  console.log('Read route names from file')
  routeNames = routeNamesArr.reduce(function(map, bus) {
    map[String(bus.route_id)] = bus.route_short_name;
    return map;
  }, {});
}

module.exports = {
  fetchBusData,
  readRouteNames,
  getRouteName, 
  datapath
}
