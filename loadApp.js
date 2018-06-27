import {routeMiddleware} from "./app/models/routeMiddleware";
import {findUsers} from "./app/models/user";
import {run} from "./app/models/run";
import {authenticate} from "./app/models/authenticate";
import {check} from "express-validator/check/index";
import {setupUser} from "./app/models/setupUser";

export const loadApp = () => {

// =======================
// configuration =========
// =======================
    let express = require('express');
    let app = express();
    let bodyParser = require('body-parser');
    let morgan = require('morgan');
    let mongodb = require('mongodb');
    let config = require('./config');
    let port = process.env.PORT || 8080;
    let https = require('https');
    let fs = require('fs');
    let options = {
        key: fs.readFileSync('./certificatSSL/ca.key', 'utf8'),
        cert: fs.readFileSync('././certificatSSL/ca.crt', 'utf8')
    };


    mongodb.connect(config.database);
    app.set('superSecret', config.secret);
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());
    app.use(morgan('dev'));


// =======================
// routes ================
// =======================
// basic route
    app.get('/', function (req, res) {
        res.send('Hello! The APy is at http://localhost:' + port + '/api');
    });


    app.get('/setup', setupUser);

// API ROUTES

    // get an instance of the router for api routes
    var apiRoutes = express.Router();


    // route to authenticate a user (POST http://localhost:8080/api/authenticate)
    apiRoutes.post('/authenticate',
        [
            check('name').isLength({min: 2}).matches(/^.+/),
            check('password').isLength({min: 2}).matches(/^.+/),

        ],
        run(authenticate));
// route middleware
    apiRoutes.use(routeMiddleware);


    apiRoutes.get('/', function (req, res) {
        res.json({message: 'Welcome to the API !!'});
    });


//route to return all users

    apiRoutes.get('/user', run(findUsers));


    app.use('/api', apiRoutes);


// =======================
// start the server ======
// =======================
    //app.listen(8080);
    https.createServer(options, app).listen(port);
    console.log('Magic happens at https://localhost:' + port);

};