'use-strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CurrencySchema = Schema({
    // Attributes
    code: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 5,
        default: 'USD'
    },
    symbol: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 5,
        default: '$'
    }
}, { timestamps: true });

module.exports = mongoose.model('Currency', CurrencySchema);