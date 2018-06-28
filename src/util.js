import {ValidationError} from "./errors/errors";

const {validationResult} = require('express-validator/check');
const {matchedData} = require('express-validator/filter');

export const debug = (...obj) => {
    console.log(JSON.stringify(obj, null, 4));
};

const forbiddenError = {
    status: 403
};

function throwForbiddenError() {
    throw forbiddenError;
}

export const isAdmin = user => user.admin || throwForbiddenError();

export const verify = job => (req, res, next) => {
    try {
        job(req.token.user);
        next();
    } catch (e) {
        debug("FORBIDDEN ACCESS", e);
        res.status(e.status).end();
    }
};

export const run = (work) => {
    let validResultJson = async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ValidationError(errors.mapped());
        } else {
            let body = await work(matchedData(req), req, res, next);
            res.json(body);
            debug("res", body);
        }
    };

    return (req, res, next) => {
        Promise
            .resolve(validResultJson(req, res, next))
            .catch(next);
    };
};
