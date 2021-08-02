'use strict'
const { check, body } = require('express-validator');
const Reservation = require('../models/reservation');

exports.validate = (method) => {
    switch (method) {
        case 'saveReservation':
            {
                return [
                    body('property', "Please select a property").exists(),
                    body('dateBegin', "Valid begin date required").exists().isString(),
                    body('dateEnd', "Valid end date required").exists().isString(),
                    body('guests', 'Please select a valid number of guests').exists()
                ]
            }
            break;
    }

}