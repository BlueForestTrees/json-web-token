import {insertUser} from "./user";


export const setupUser = function (req, res) {

    insertUser("Slim", "1234", true);
    insertUser("Clement", "1234", false);

    console.log('User saved successfully');
    return res.json({success: true});

};