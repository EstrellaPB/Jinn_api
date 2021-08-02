'use strict'
const { check, body } = require('express-validator');
const Currency = require('../models/currency');

exports.validate = (method) => {
    switch (method) {
        case 'saveCurrency':
            {
                return [
                    body('code', "Valid code required for currency").exists().isLength({ min: 1, max: 5 }),
                    body('symbol', "Valid symbol required").exists().isLength({ min: 1, max: 5 })
                ]
            }
            break;
    }

}