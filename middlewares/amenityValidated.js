'use strict'
const { check, body } = require('express-validator');
const Amenity = require('../models/amenity');

exports.validate = (method) => {
    switch (method) {
        case 'saveAmenity':
            {
                return [
                    body('name', "Valid name required for amenity").exists().isLength({ min: 4, max: 100 }),
                    body('enabled', "Please provide valid state of amenity").isBoolean()
                ]
            }
            break;
    }

}