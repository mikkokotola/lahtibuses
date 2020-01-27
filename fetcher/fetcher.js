var GtfsRealtimeBindings = require('gtfs-realtime-bindings');
const request = require('request-promise-native');
const fs = require('fs');

const walttiUserName = process.env.WALTTIUSERNAME
const walttiPassword = process.env.WALTTIPASSWORD
const city = process.env.CITY
const routeNamepath = './busRouteNames/routes.txt';
const parse = require('csv-parse/lib/sync')
var routeNames;

async function fetchBusData() {
  var requestSettings = {
    method: 'GET',
    url: 'https://' + walttiUserName + ':' + walttiPassword + '@data.waltti.fi/' + city + '/api/gtfsrealtime/v1.0/feed/vehicleposition',
    encoding: null    
  };
  var buses = [];
  await request(requestSettings, function (error, response, body) {
    //console.log('Got response from API. Status code: ' + response.statusCode);

    if (!error && response.statusCode == 200) {
      var feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(body);
      feed.entity.forEach(function(entity) {
        var bus = JSON.parse(JSON.stringify(entity));
        bus.vehicle.trip.routeName = getRouteName(bus.vehicle.trip.routeId);
        buses.push(bus);
      });
    }
  });
  return (buses);
}

function getRouteName(id) {
  if (routeNames === undefined) {
    readRouteNames();    
  }
  
  if (routeNames[id]){
    return routeNames[id]    
  } else {
    return '-';
  }
}

function readRouteNames() {
  var routeNameData = fs.readFileSync(routeNamepath, {encoding:'utf8'});
  routeNamesArr = parse(routeNameData, {
    columns: true,    
    skip_empty_lines: true
  });
  console.log('Read route names from file ' + routeNamepath)
  routeNames = routeNamesArr.reduce(function(map, bus) {
    map[String(bus.route_id)] = bus.route_short_name;
    return map;
  }, {});
}

module.exports = {
  fetchBusData,
  readRouteNames,
  getRouteName
}