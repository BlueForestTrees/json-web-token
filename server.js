import {dbConnect} from "./app/models/db";
import {ENV} from "./app/models/env";
import {loadApp} from "./loadApp";


dbConnect().then((loadApp));