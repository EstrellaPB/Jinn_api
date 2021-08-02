'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');

function createToken(user) {
    var secret = 'clave_secreta_curso';
    var payload = {
        sub: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix()
    };
    return jwt.encode(payload, secret)
};

function createResetPasswordToken(userId, password, createdAt) {
    var secret = password + "_" + createdAt;
    console.log("Secret create: ", secret);
    var payload = {
        sub: userId,
        iat: moment().unix(),
        exp: moment().add(60, 'minutes').unix()
    }
    var token = jwt.encode(payload, secret);
    return token;
}

function readResetPasswordToken(password, createdAt, token) {
    var secret = password + "_" + createdAt;
    try {
        token = token.replace(/['"]+/g, '');
        console.log(token);
        var payload = jwt.decode(token, secret);
        console.log(payload);
        return payload;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

module.exports = {
    createToken,
    createResetPasswordToken,
    readResetPasswordToken
}