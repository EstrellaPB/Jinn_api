'use-strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PropertySchema = Schema({
    // Attributes
    title: {
        type: String,
        minlength: 4,
        maxlength: 100,
        required: true
    },
    description: {
        type: String,
        minlength: 4,
        maxlength: 255,
        required: true
    },
    stars: {
        type: Number,
        required: false,
        default: 0
    },
    enabled: {
        type: Boolean,
        default: true
    },
    price: mongoose.Types.Decimal128,
    images: [{
        name: String
    }],
    address: {
        type: String,
        required: false
    },
    location: {
        type: Object,
        required: false
    },
    maxGuests: {
        type: Number,
        required: true
    },

    // Relations
    currency: {
        type: Schema.Types.ObjectId,
        ref: 'Currency',
        required: true
    },
    amenities: [{
        qty: Number,
        amenity: {
            type: Schema.Types.ObjectId, ref: 'Amenity'
        }
    }],
    reviews: [{
        user: {
            type: Schema.Types.ObjectId, ref: 'User',
            required: true
        },
        stars: {
            type: Number,
            required: false,
            default: 0
        },
        comment: {
            type: String,
            required: false
        }
    }],
    homeowner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Property', PropertySchema);