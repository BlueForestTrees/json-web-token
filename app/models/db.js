import mongodb from 'mongodb';
import ENV from "./env";


const client = mongodb.MongoClient;
const connectionString = `mongodb://${ENV.DB_HOST}:${ENV.DB_PORT}/${ENV.DB_NAME}`;

let database = null;

export const dbConnect = () => {
    console.log("Connecting mongo with '" + connectionString + "'...");
    return client.connect(connectionString)
        .then(db => {
            console.log("connected");
            database = db
        });
};

export const col = collectionName => {
   return  database.collection(collectionName);
};