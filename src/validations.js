import {check} from 'express-validator/check';

export const isAdmin = check("name").custom((v, {req}) => req.token.user.admin).withMessage('droits requis');