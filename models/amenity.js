'use-strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AmenitySchema = Schema({
    // Attributes
    name: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 100
    },
    enabled: {
        type: Boolean,
        default: true
    },
    icon: {
        type: String,
        required: true,
        default: ''
    }
}, { timestamps: true });

module.exports = mongoose.model('Amenity', AmenitySchema);