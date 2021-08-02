'use strict'

var express = require('express');
var RoleController = require('../controllers/role');

//cargar router de express
var api = express.Router();

api.get('/pruebasRole', RoleController.pruebasRole);
api.post('/save-role', RoleController.saveRole);

module.exports = api;