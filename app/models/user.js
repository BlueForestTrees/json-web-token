import {cols} from "./collections";
import {col} from "./db";



const users = () => col(cols.USER);

export const createUser = (name, _password, admin) => ({name, _password, admin});

export const insertUser = user => users().insertOne(user);

export const findUsers = async () => users().find({}).toArray();

export const findUserByName =  name => users().findOne({name});





