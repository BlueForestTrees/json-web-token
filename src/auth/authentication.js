import {findUserByName} from "./user";
import sha1 from "sha1";
import jwt from 'jsonwebtoken';
import {check} from "express-validator/check/index";
import {run} from "../util";
import ENV from "../env/env";

export const authenticateRouter = (router) => {
    router.post('/authenticate',
        [
            check('name').exists(),
            check('password').exists(),
        ],
        run(authenticate)
    );
    router.use(checkToken);
    return router;
};

export const authenticate = async function ({name, password}) {
    const user = await findUserByName(name);
    if (!user) {
        return ({success: false, message: 'Authentication failed. User not found.'});
    } else if (user._password === sha1(password)) {
        delete user._password;
        return ({
            success: true,
            message: 'Enjoy your token!',
            token: jwt.sign({user}, ENV.TOKEN_SECRET, {expiresIn: "1d"})
        });
    } else {
        return ({success: false, message: 'Authentication failed. Wrong password.'});
    }
};

export const checkToken = function (req, res, next) {
    const token = req.headers['x-access-token'];
    if (token) {
        try {
            req.token = jwt.verify(token, ENV.TOKEN_SECRET);
            next();
        } catch (e) {
            return res.status(403).send({
                success: false,
                message: 'Invalid token.'
            });
        }
    } else {
        return res.status(401).send({
            success: false,
            message: 'No token provided.'
        });
    }
};