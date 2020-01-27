const fetchBusData = require('../fetcher/fetcher.js').fetchBusData;

const busRoutes = (app) => {
  app.get('/buses', async (req, res) => {
    var busData;
    try {
      busData = await fetchBusData();
    } catch (error) {
      console.log(error);
    }
    res.send(busData);
  });
}

module.exports = busRoutes;
