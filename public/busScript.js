var updateIntervalInMs = 5000
var icon;
var mapInitialCenterPos = {
    lat: 60.976651,
    lng: 25.666292
}
var map;
var markers = [];

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: mapInitialCenterPos,
        zoom: 13
    });

    icon = {
        url: 'https://svgsilh.com/png/296715-3f51b5.png', // url
        scaledSize: new google.maps.Size(25, 25), // scaled size            
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 0)
    };
    updateMap();
}
function updateMap() {
    const url = 'http://localhost:3001/buses';

    fetch(url)
        .then(function (response) {
            response.json()
                .then(function (buses) {
                    tmpMarkers = markers;
                    deleteMarkers();
                    console.log('Got response, processing buses');
                    buses.forEach(bus => {
                        // Only make markers for Lahti area - API seems to be giving data for wrong city occasionally
                        if (bus.vehicle.position.latitude > 60.60 && bus.vehicle.position.latitude < 61.40 && bus.vehicle.position.longitude > 24.70 && bus.vehicle.position.longitude < 26.50) {
                            makeMarker(bus.vehicle.position.latitude, bus.vehicle.position.longitude, bus.vehicle.trip.routeName);
                        }
                    });
                    if (markers.length == 0) {
                        markers = tmpMarkers;
                    }
                    showMarkers();
                });
        });
}

function makeMarker(lat, lon, txt) {
    console.log('Making marker with text ' + txt);
    var marker = new google.maps.Marker({
        position: { lat: lat, lng: lon },
        map: map,
        icon: icon,
        label: { color: '#000000', fontWeight: 'bold', fontSize: '16px', text: txt }
    });
    console.log('Pushing marker with latlon ' + lat + ', ' + lon);
    markers.push(marker);
}

// Sets the map on all markers in the array.
function setMapOnAll(mapp) {
    console.log('In setMapOnAll, markers length ' + markers.length);
    for (var i = 0; i < markers.length; i++) {
        console.log(markers[i]);
        markers[i].setMap(mapp);
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
    markers = [];
}

setInterval(updateMap, updateIntervalInMs);