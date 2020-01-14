const busRoutes = require('./busRoutes.js');

const appRouter = (app, fs) => {

    app.get('/', (req, res) => {
        res.send('Bus data server. Make calls to /buses');
    });


    // Bus route module
    busRoutes(app, fs);
};

module.exports = appRouter;