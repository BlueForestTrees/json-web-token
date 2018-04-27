import {cols} from "./collections";
import {col} from "../../db";


const users = () => col(cols.USER);

export const createUser = (name, _password, admin) => ({name, _password, admin});

export const insertUser = user => users().insertOne(user);

export const findUser = user => users().findOne(user);

/*

// get an instance of mongoose and mongoose.Schema
var mongodb = require('mongodb');
var Schema = mongodb.Schema;



// set up a mongoose model and pass it using module.exports
module.exports = mongodb.model('User', new Schema({
    name: String,
    password: String,
    admin: Boolean
}));
*/