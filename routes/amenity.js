'user strict'

var express = require('express');
var AmenityController = require('../controllers/amenity');

var api = express.Router();

// middlewares
var md_auth = require('../middlewares/authenticated');
var md_amenity = require('../middlewares/amenityValidated');
var md_permit = require('../middlewares/permitted');


// creando rutas
api.get('/amenity/get-all', md_auth.ensureAuth, AmenityController.getAll);
api.post('/amenity', md_auth.ensureAuth, md_permit.permit('saveAmenity'), AmenityController.saveAmenity);

module.exports = api;