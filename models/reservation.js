'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//objeto de tipo esquema

var ReservationSchema = Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    property: {
        type: Schema.Types.ObjectId,
        ref: 'Property',
        required: true
    },
    dateBegin: {
        type: Schema.Types.Date,
        required: true
    },
    dateEnd: {
        type: Schema.Types.Date,
        required: true
    },
    guests: [{
        qty: Number,
        guestType: String
    }],
    approved: {
        type: Schema.Types.Boolean,
        required: true,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Reservation', ReservationSchema);