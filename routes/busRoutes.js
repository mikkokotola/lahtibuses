const datapath = require('../fetcher/fetcher.js').datapath;
const getRouteName = require('../fetcher/fetcher.js').getRouteName;

const busRoutes = (app, fs) => {

    // READ
    app.get('/buses', (req, res) => {
      fs.readFile(datapath, 'utf8', (err, data) => {
            console.log('Read file')
            if (err) {
                throw err;
            }

            if (data != null) {
              busdata = JSON.parse(data)
              busdata.forEach(bus => {
                bus.vehicle.trip.routeName = getRouteName(bus.vehicle.trip.routeId)
              });
              res.send(busdata);
            } else {
              res.send();
            }            
        });
    });
};

module.exports = busRoutes;
