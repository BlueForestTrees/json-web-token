import {findUserByName} from "./user";
import * as config from "../../config";


let jwt = require('jsonwebtoken');
let express = require('express');
let app = express();
let sha1 = require('sha1');

app.set('superSecret', config.secret);


//export const authenticate = async ({name, password}) => {
export const authenticate = async function ({name, password}) {
    const user = await findUserByName(name);
    if (!user) {
        return ({success: false, message: 'Authentication failed. User not found.'});
    } else if (user) {

        // check if password matches
        if (user._password !== sha1(password)) {
            return ({success: false, message: 'Authentication failed. Wrong password.'});
        } else {

            // if user is found and password is right
            // create a token with only our given payload
            // we don't want to pass in the entire user since that has the password
            const payload = await {
                admin: user.admin
            };
            var token = jwt.sign(payload, app.get('superSecret'), {
                expiresIn: "1d" // expires in 24 hours
            });

            // return the information including token as JSON
            return ({
                success: true,
                message: 'Enjoy your token!',
                token: token
            });
        }

    }


};