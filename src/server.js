import {dbConnect} from "./db/db";
import {ENV} from "./env/env";
import {findUsers, insertUser} from "./auth/user";
import {setupUser} from "./auth/setupUser";
import {authenticateRouter} from "./auth/authentication";
import {debug, run} from "./util";
import {isAdmin} from "./validations";
import {check} from 'express-validator/check';

let https = require('https');
let fs = require('fs');
let express = require('express');
let bodyParser = require('body-parser');
let morgan = require('morgan');

dbConnect().then(() => {
    let port = process.env.PORT || 443;
    let options = {
        key: fs.readFileSync('certificatSSL/ca.key', 'utf8'),
        cert: fs.readFileSync('certificatSSL/ca.crt', 'utf8')
    };
    let app = express();

    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());
    app.use(morgan('dev'));
    app.get('/setup', setupUser);
    const secureRouter = authenticateRouter(express.Router());
    secureRouter.get('/user', run(findUsers));

    secureRouter.post('/user', [
        check('name').exists(),
        check('_password').exists(),
        check('admin').exists(),
        isAdmin
    ], run(({name, _password, admin}) => insertUser({name, _password, admin})));

    app.use('/api', secureRouter);

    app.use(function (err, req, res) {
        console.error("UNHANDLED ERROR", err.stack);
        res.status(err.status || 500).json({message: err.message});
    });


    https.createServer(options, app).listen(port);
    console.log('API started');
});




