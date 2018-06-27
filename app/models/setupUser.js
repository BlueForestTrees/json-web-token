import {createUser, insertUser} from "./user";

let sha1 = require('sha1');
export const setupUser = function (req, res) {


    const clement = createUser("Clement", sha1("1234"), true);
    const antoine = createUser("Antoine", sha1("bonjour"), true);
    const toto = createUser("toto", sha1("toto"), true);
    insertUser(clement);
    insertUser(antoine);
    insertUser(toto);

    console.log('User saved successfully');
    return res.json({success: true});

};