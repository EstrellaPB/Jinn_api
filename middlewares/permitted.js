'use strict'
const { check, body } = require('express-validator');

var User = require('../models/user');
var Role = require('../models/role');

// exports.permit = (permission) => {

exports.permit = function(permission) {
    const perm = permission;
    return (req, res, next) => {
        console.log(perm);
        console.log(req.user.role);
        Role.findById(req.user.role).populate('permissions').
        exec().
        then((roleFound) => {
            let found = roleFound.permissions.find(function(element) {
                return element.name == perm
            });
            if (!!found) {
                return next()
            } else {
                return res.status(401).send({ message: 'unauthorized' });
            }
        }).catch(err => {
            return res.status(500).send({ message: 'role not found' });
        });
    }
}