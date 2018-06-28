import {dbConnect} from "./db/db";
import ENV from "./env/env";
import {findUserByName, findUsers, insertUser} from "./auth/user";
import {authenticate, authenticateRouter, checkToken} from "./auth/authentication";
import {debug, isAdmin, run, verify} from "./util";
import {check} from 'express-validator/check';

let https = require('https');
let fs = require('fs');
let express = require('express');
let bodyParser = require('body-parser');
let morgan = require('morgan');
let app = express();

const preFetchDatas = async () => {
    if (!await findUserByName(ENV.USER_NAME)) {
        await insertUser({name: ENV.USER_NAME, password: ENV.USER_PASSWORD, admin: ENV.USER_ADMIN});
        debug(`user '${ENV.USER_NAME}' added`);
    } else {
        debug(`user '${ENV.USER_NAME}' exists`);
    }
};
const confMiddleware = () => {
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());
    app.use(morgan(ENV.MORGAN))
};
const logRequest = () => {
    app.use(function (req, res, next) {
        debug("req", {user: req.token && req.token.user, url: `${req.method} ${req.url}`}, {params: req.params}, {body: req.body});
        next();
    });
};
const apiRouter = () => {
    const router = express.Router();
    router.post('/api/authenticate',
        [
            check('name').exists(),
            check('password').exists(),
        ],
        run(authenticate)
    );
    router.get('/api/user', run(findUsers));
    router.post('/api/user',
        checkToken,
        verify(isAdmin),
        [
            check('name').exists(),
            check('password').exists(),
            check('admin').exists()
        ],
        run(({name, password, admin}) => insertUser({name, password, admin}))
    );

    app.use(router);
};
const errorMiddleware = () => {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        let responseBody = null;
        if (err.body) {
            responseBody = err.body;
        } else if (err.message) {
            responseBody = {error: err.message};
        }
        res.json(responseBody);
        debug("res", responseBody);
    })
};
const startHttps = () => {
    let options = {
        key: fs.readFileSync('certificatSSL/ca.key', 'utf8'),
        cert: fs.readFileSync('certificatSSL/ca.crt', 'utf8')
    };
    https.createServer(options, app).listen(ENV.PORT);

    console.log('API started');
};

dbConnect()
    .then(preFetchDatas)
    .then(confMiddleware)
    .then(logRequest)
    .then(apiRouter)
    .then(errorMiddleware)
    .then(startHttps)
;

