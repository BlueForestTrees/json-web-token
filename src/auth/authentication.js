import {findUserByName} from "./user";
import sha1 from "sha1";
import jwt from 'jsonwebtoken';
import ENV from "../env/env";
import {UnauthorizedError} from "../errors/errors";

export const authenticate = async function ({name, password}, req, res) {
    const user = await findUserByName(name);
    if (!user) {
        throw new UnauthorizedError("unknown login");
    } else if (user.password !== sha1(password)) {
        throw new UnauthorizedError("bad password");
    } else {
        delete user.password;
        const token = jwt.sign({user}, ENV.TOKEN_SECRET, {expiresIn: "1d"});
        res.header("x-access-token", token);
    }
};

export const checkToken = function (req, res, next) {
    const token = req.headers['x-access-token'];
    if (token) {
        try {
            req.token = jwt.verify(token, ENV.TOKEN_SECRET);
            next();
        } catch (e) {
            throw new UnauthorizedError("bad token", e);
        }
    } else {
        throw new UnauthorizedError("missing token");
    }
};