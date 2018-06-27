const {validationResult} = require('express-validator/check');
const {matchedData} = require('express-validator/filter');

export const debug = (...obj) => {
    console.log(JSON.stringify(obj, null, 4));
};

export const run = (work) => {

    let validResultJson = async (req, res, next) => {
        const error = validationResult(req);
        if (error) {
            const mapped = error.mapped();
            debug("VALIDATION ERROR", mapped);
            res.status(422).json(mapped);
        } else {
            let result = await work(matchedData(req), req, res, next);
            res.json(result);
            debug("result", result);
        }
    };

    return (req, res, next) => {

        debug("run", {user: req.token && req.token.user, url: `${req.method} ${req.url}`}, {params: req.params}, {body: req.body});

        let result = validResultJson(req, res, next);
        Promise
            .resolve(result)
            .catch(err => {
                return next(err);
            });
    };
};
