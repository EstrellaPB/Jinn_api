'use strict'

var express = require('express');
var PermissionController = require('../controllers/permission');

//cargar router de express
var api = express.Router();

api.get('/pruebasPermission', PermissionController.pruebasPermission);
api.post('/save-permission', PermissionController.savePermission);

module.exports = api;