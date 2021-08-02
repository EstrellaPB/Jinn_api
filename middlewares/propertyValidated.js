'use strict'
const { check, body } = require('express-validator');
const Property = require('../models/property');

exports.validate = (method) => {
    switch (method) {
        case 'saveProperty':
            {
                return [
                    body('title', "Valid title required for property").exists().isLength({ min: 4, max: 100 }),
                    body('description', "Valid description required").exists().isLength({ min: 4, max: 255 }),
                    body('price', 'Valid price required').exists().isDecimal(),
                    body('currency', 'Valid currency required').exists(),
                    body('maxGuests', 'Valid maximum guests number required').exists(),
                    body('homeowner', 'Valid homeowner required').exists()
                ]
            }
            break;
        case 'updateProperty':
            {
                return [
                    body('title', "Valid title required for property").exists().isLength({ min: 4, max: 100 }),
                    body('description', "Valid description required").exists().isLength({ min: 4, max: 255 }),
                    body('price', 'Valid price required').exists().isDecimal(),
                    body('currency', 'Valid currency required').exists()
                ]
            }
            break;
        case 'makeReview':
            {
                return [
                    body('user', "Valid user required for review").exists(),
                    body('stars', "Valid stars rate required").exists()
                ]
            }
            break;
    }

}