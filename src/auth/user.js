import {cols} from "../db/collections";
import {col} from "../db/db";

let sha1 = require('sha1');

const users = () => col(cols.USER);

export const insertUser = ({name, _password, admin}) => users().insertOne({name, _password: sha1(_password), admin});

export const findUsers = async () => users().find({}).toArray();

export const findUserByName = name => users().findOne({name});





