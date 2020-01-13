const dataPath = './data/buses.json';

const busRoutes = (app, fs) => {

    // READ
    app.get('/buses', (req, res) => {
      fs.readFile(dataPath, 'utf8', (err, data) => {
            console.log('Read file')
            if (err) {
                throw err;
            }

            if (data != null) {
              res.send(JSON.parse(data));
            } else {
              res.send()
            }

            
        });
    });
};

module.exports = busRoutes;
