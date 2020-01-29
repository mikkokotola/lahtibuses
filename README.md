# Lahti buses on a map - frontend
Frontend that fetches real time bus location data in Lahti from the backend and displays the buses on Google maps. Bus location data is from LSL / Waltti API.

![alt text](./lahtibuses_screen.png "Lahti buses screencapture")

## Deployed version
The app is deployed at https://lahti-buses.appspot.com/.

## Backend
Source for cloud function version of backend is at https://github.com/mikkokotola/lahtibuses-backendfunction.

One instance of backend is deployed as a cloud function at https://europe-west1-lahti-buses.cloudfunctions.net/busdata.

## How to install and run
- Register a Google cloud platform account - see https://developers.google.com/maps/gmp-get-started
- Create an API key for use in Google Map Javasript API - see https://developers.google.com/maps/documentation/javascript/get-api-key
- Insert your Google API key into the google maps URL at the end of public/index.html
- Open the file index.html in your browser or serve the files from a server

## Other configuration
- The polling interval can be set by modifying the value `const updateIntervalInMs = 5000` in busScript.js.
- The backend urls can be set by modifying the following values in busScript.js: 
```
const urlBase = 'https://europe-west1-lahti-buses.cloudfunctions.net/busdata';
const url = urlBase + '/busdata';
```
- The default map center position (used if user does not give permission to use her position) in busScript.js: 
```
const mapDefaultCenter = {
    lat: 60.976651,
    lng: 25.666292
};
```

## Source data
Waltti API documentation is available at https://opendata.waltti.fi/.

## How it works
The frontend polls the backend and updates a Google maps map according to the data, creating an icon for every bus that the backend returns. User's position is marked and map is centered to it if the user gives permission.