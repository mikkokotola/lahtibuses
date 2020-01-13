const busRoutes = require('./busRoutes');

const appRouter = (app, fs) => {

    // we've added in a default route here that handles empty routes
    // at the base API url
    app.get('/', (req, res) => {
        res.send('Welcome to the development api-server');
    });


    // run our bus route module
    busRoutes(app, fs);
};

module.exports = appRouter;