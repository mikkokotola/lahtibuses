const urlBase = '';
const url = urlBase + '/buses';
const updateIntervalInMs = 5000
var map;
var busMarkers = [];
var ownPositionMarker;
var icon;
const mapDefaultCenter = {
    lat: 60.976651,
    lng: 25.666292
};

const geo_options = {
    enableHighAccuracy: true,
    maximumAge: 30000,
    timeout: 27000
};

function createMap(mapCenter) {
    map = new google.maps.Map(document.getElementById('map'), {
        center: mapCenter,
        zoom: 15
    });

    icon = {
        url: 'https://svgsilh.com/png/296715-3f51b5.png', // url
        scaledSize: new google.maps.Size(25, 25), // scaled size            
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 0)
    };
}

function createMapWithGeoLocation(position) {
    mapCenter = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
    };
    createMap(mapCenter);
    updateMap();
    var wpid = navigator.geolocation.watchPosition(geo_success, geo_error, geo_options);
}

function createMapWithDefaultLocation() {
    createMap(mapDefaultCenter);
    updateMap();
    var wpid = navigator.geolocation.watchPosition(geo_success, geo_error, geo_options);
}

function initMap() {
    navigator.geolocation.getCurrentPosition(createMapWithGeoLocation, createMapWithDefaultLocation, geo_options);
}

function updateMap() {
    fetch(url)
        .then(function (response) {
            response.json()
                .then(function (buses) {
                    tmpMarkers = busMarkers;
                    deleteMarkers();
                    console.log('Got response, processing buses');
                    buses.forEach(bus => {
                        // Only make markers for Lahti area - API seems to be giving data for wrong city occasionally
                        if (isWithinGeoBox(bus)) {
                            makeBusMarker(bus.vehicle.position.latitude, bus.vehicle.position.longitude, bus.vehicle.trip.routeName);
                        }
                    });
                    if (busMarkers.length == 0) {
                        busMarkers = tmpMarkers;
                    }
                    showMarkers();
                });
        });
}

function makeOwnPositionMarker(lat, lon) {
    console.log('Making own position marker');
    if (ownPositionMarker) {
        ownPositionMarker.setMap(null);
    }
    ownPositionMarker = new google.maps.Marker({
        position: { lat: lat, lng: lon },
        map: map        
    });
    ownPositionMarker.setMap(map);
}

function makeBusMarker(lat, lon, txt) {
    console.log('Making marker with text ' + txt);
    var marker = new google.maps.Marker({
        position: { lat: lat, lng: lon },
        map: map,
        icon: icon,
        label: { color: '#000000', fontWeight: 'bold', fontSize: '16px', text: txt }
    });
    console.log('Pushing marker with latlon ' + lat + ', ' + lon);
    busMarkers.push(marker);
}

// Sets the map on all markers in the array.
function setMapOnAll(mapp) {
    console.log('In setMapOnAll, markers length ' + busMarkers.length);
    for (var i = 0; i < busMarkers.length; i++) {
        console.log(busMarkers[i]);
        busMarkers[i].setMap(mapp);
    }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
    console.log('In clearMarkers');
    setMapOnAll(null);
}

// Shows any markers currently in the array.
function showMarkers() {
    console.log('In showMarkers');
    setMapOnAll(map);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
    clearMarkers();
    busMarkers = [];
}

function isWithinGeoBox(bus) {
    return bus.vehicle.position.latitude > 60.60 && bus.vehicle.position.latitude < 61.40 && bus.vehicle.position.longitude > 24.70 && bus.vehicle.position.longitude < 26.50
}

function geo_success(position) {
    makeOwnPositionMarker(position.coords.latitude, position.coords.longitude);
    map.panTo({
        lat: position.coords.latitude,
        lng: position.coords.longitude
    });
}

function geo_error() {
    alert("No geolocation available for user, centering Map in downtown Lahti");
}

setInterval(updateMap, updateIntervalInMs);