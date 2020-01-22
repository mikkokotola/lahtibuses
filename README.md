# Lahti buses on a map
This simple Node.js app fetches real time bus location data from the LSL / Waltti API and displays the buses on Google maps.

![alt text](./lahtibuses_screen.png "Lahti buses screencapture")

## How to install
- Install Node.js (see https://nodejs.org/en/download/)
- Run `npm install` in the root folder - this installs dependencies
- Register a Waltti Id account - see https://opendata.waltti.fi/getting-started
- Insert your Waltti credentials into fetchBusData.js (note: retrieving secrets from ENV not implemented yet)
- Register a Google cloud platform account - see https://developers.google.com/maps/gmp-get-started
- Create an API key for use in Google Map Javasript API - see https://developers.google.com/maps/documentation/javascript/get-api-key
- Insert your Google API key into the google maps URL at the end of lahtibuses.html (note: retrieving secrets from ENV not implemented yet)

## How to run locally
- Start the bus data fetching routine by running `node fetcher.js`
- Start the web server by running `npm start` - this will start the server at localhost:3001
- Open the html file lahtibuses.html in a browser

## How it works
The fetcher retrieves data from the Waltti API and writes the data in JSON format into the file /data/buses.json. The server serves data from that file upon requests to the path http://localhost:3001/buses. The frontend polls the backend and updates a Google maps map according to the data, creating an icon for every bus that the backend returns.
