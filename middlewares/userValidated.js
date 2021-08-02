'use strict'
const { check, body } = require('express-validator');
var User = require('../models/user');

exports.validate = (method) => {
    switch (method) {
        case 'saveUser':
            {
                return [
                    body('name', "Valid name required").exists().isLength({ min: 4, max: 100 }),
                    body('surname', "Valid surname required").exists().isLength({ min: 4, max: 100 }),
                    body('email', 'Valid email is required').exists().isEmail().custom(value => {
                        return User.emailIsUnique(value);
                    }),
                    body('password', 'Valid password required').exists().isLength({ min: 4, max: 160 }),
                    body('confirmPassword', 'Valid password required').exists().isLength({ min: 4, max: 160 }).custom((value, { req }) => {
                        return User.passwordConfirm(value, req.body.password);
                    }),
                    body('role', 'Role required').exists()
                ]
            }
            break;
        case 'loginUser':
            {
                return [
                    body('email', 'Valid email is required').exists().isEmail(),
                    body('password', 'Valid password required').exists().isLength({ min: 4, max: 160 })
                ]
            }
            break;
        case 'updateUser':
            {
                return [
                    body('name', "Valid name required").exists().isLength({ min: 4, max: 100 }),
                    body('surname', "Valid surname required").exists().isLength({ min: 4, max: 100 }),
                    body('email', 'Valid email is required').exists().isEmail().custom((value, { req }) => {
                        return User.emailIsUnique(value, req.params.id);
                    }),
                    body('role', 'Role required').exists()
                ]
            }
            break;
        case 'userPasswordReset':
            {
                return [
                    body('password', 'Valid password required').exists().isLength({ min: 4, max: 160 }),
                    body('confirmPassword', 'Valid password required').exists().isLength({ min: 4, max: 160 }).custom((value, { req }) => {
                        return User.passwordConfirm(value, req.body.password);
                    })
                ]
            }
            break;
        case 'updateProfileUser':
            {
                return [
                    body('name', "Valid name required").exists().isLength({ min: 4, max: 100 }),
                    body('surname', "Valid surname required").exists().isLength({ min: 4, max: 100 }),
                    body('email', 'Valid email is required').exists().isEmail().custom((value, { req }) => {
                        return User.emailIsUnique(value, req.params.id);
                    })

                ]
            }
    }

}