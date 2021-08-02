'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');

//objeto de tipo esquema

var UserSchema = Schema({
    name: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 100
    },
    surname: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 100
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        minlength: 10,
        maxlength: 100,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 160
    },
    role: {
        type: Schema.Types.ObjectId,
        ref: 'Role'
            // required: true
    },
    image: {
        type: String
    },
    favorites: [{
        type: Schema.Types.ObjectId, ref: 'Property'
    }]
}, { timestamps: true });

UserSchema.statics.hashPassword = function(password) {
    return new Promise(resolve => {
        bcrypt.hash(password, 10, function(err, hash) {
            password = hash;
            console.log('passhash: ' + hash);
            // return password;
            resolve(hash);
        });
    });
}
UserSchema.statics.emailIsUnique = function(email, except) {
    var query = { email: email }
    if (except) {
        query = { email: email, _id: { $nin: [except] } };
    }
    return this.find(query).then(function(users) {
        if (users.length > 0) {
            return Promise.reject('The email is already in use');
        }
    });
}

UserSchema.statics.passwordConfirm = function(passwordConfirm, password) {
    if (password !== passwordConfirm) {
        throw new Error('Password confirmation does not match password');
    }
    return true;
}
module.exports = mongoose.model('User', UserSchema);