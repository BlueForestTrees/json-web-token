// =======================
// get the packages we need ============
// =======================
import {createUser, findUser, insertUser} from "./app/models/user";
import {dbConnect, db} from "./db";
import {ENV} from "./app/models/env";
import {check} from 'express-validator/check';
import {run} from "./app/run";


var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongodb = require('mongodb');

var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
var User = require('./app/models/user'); // get our mongoose model

const start = () => {



// =======================
// configuration =========
// =======================
    var port = process.env.PORT || 8080; // used to create, sign, and verify tokens
    mongodb.connect(config.database); // connect to database
    app.set('superSecret', config.secret); // secret variable

// use body parser so we can get info from POST and/or URL parameters
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());

// use morgan to log requests to the console
    app.use(morgan('dev'));

// =======================
// routes ================
// =======================
// basic route
    app.get('/', function (req, res) {
        res.send('Hello! The API is at http://localhost:' + port + '/api');
    });

//=====User====
    app.get('/setup', function (req, res) {

        // create a sample User
        /*  var nick = new User({
              name: 'Nick Cerminara',
              password: 'password',
              admin: true
          });

              // save the sample User
          nick.save(function (err) {
              if (err) throw err;

              console.log('User saved successfully');
              res.json({success: true});
          });*/
        const clement = createUser("Clement", "1234", true);
        insertUser(clement);
        return res.json({success: true});

    });

// API ROUTES -------------------

// get an instance of the router for api routes
    var apiRoutes = express.Router();

//route to authenticate a User (POST http://localhost:8080/api/authenticate)
  /*  apiRoutes.post('/authenticate', function (req, res) {
        //find the User
        findUser({

            name: req.body.name
        }), function (err, user) {

            if (err) throw err;
            if (!user) {
                res.json({success: false, message: 'Authentication failed. User not found.'});
            } else if (user) {

                // check if password match
                if (user.password != req.body.password) {
                    res.json({success: false, message: 'Authentication failed. Wrong password.'});
                } else {

                    // if User is found and password is right
                    // create a token with only our given payload
                    // we don't want to pass in the entire User since that has the password

                    const payload = {
                        admin: user.admin
                    };
                    var token = jwt.sign(payload, app.get('superSecret'));

                    // return information including token as JSON
                    res.json({
                        success: true,
                        message: 'Enjoy your token!',
                        token: token
                    });
                }
            }
        };

    });

// route middleware to verify a token
    apiRoutes.use(function (req, res, next) {

        // check header or url parameters or post parameters for token
        var token = req.body.token || req.query.token || req.headers['x-access-token'];
        console.log(token);
        // decode token
        if (token) {


            //verifies secret et checks exp
            jwt.verify(token, app.get('superSecret'), function (err, decoded) {
                    if (err) {
                        console.log(err);
                        return res.json({success: false, message: 'Failed to authentificate token.'});
                    } else {
                        // if everything is good, save request for use in other routes
                        req.decoded = decoded;
                        next();
                    }
                }
            );
        } else {

            // if there is no token
            // return an error
            return res.status(403).send({
                success: false,
                message: 'No token provided'
            });
        }
    });

*/
// route to show a random message (GET http://localhost:8080/api/)
    apiRoutes.get('/', function (req, res) {
        res.json({message: 'Welcome to the coolest API on earth!'});
    });

// route to return all Users (GET http://localhost:8080/api/Users)
    apiRoutes.get('/Users', function (req, res) {
        User.find({}, function (err, Users) {
            res.json(Users);
        });
    });

    apiRoutes.get('/user/:name',
        [
            check("name").isLength({min: 2}).matches(/^.+/)
        ],
        run(({name}) => findUser({name}))
    );

// apply the routes to our application with the prefix /api
    app.use('/api', apiRoutes);


// =======================
// start the server ======
// =======================
    app.listen(port);
    console.log('Magic happens at http://localhost:' + port);

};

dbConnect().then(start);