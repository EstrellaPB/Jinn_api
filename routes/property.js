'user strict'

var express = require('express');
var PropertyController = require('../controllers/property');

var api = express.Router();
const multipart = require('connect-multiparty');
const md_upload = multipart({ uploadDir: './uploads/properties' });

// middlewares
var md_auth = require('../middlewares/authenticated');
var md_property = require('../middlewares/propertyValidated');
var md_reservation = require('../middlewares/reservationValidated');
var md_permit = require('../middlewares/permitted');


//creando rutas

api.get('/property', PropertyController.getAll);
api.post('/property', md_auth.ensureAuth, md_property.validate('saveProperty'), PropertyController.saveProperty);
api.get('/property/:id', PropertyController.findPropertyById);
api.post('/property/:id/update', md_auth.ensureAuth, md_property.validate('updateProperty'), PropertyController.updateProperty);
api.get('/property/:id/owner-delete', md_auth.ensureAuth, PropertyController.deletePropertyByOwner);

api.post('/property/:id/upload-image', md_auth.ensureAuth, md_upload, PropertyController.uploadImage);
api.post('/property/:id/delete-image/:imageFile', md_auth.ensureAuth, PropertyController.deleteImage);
api.get('/property/get-image/:imageFile', PropertyController.getImageFile);
api.post('/property/:id/make-reservation', md_auth.ensureAuth, md_reservation.validate('saveReservation'), PropertyController.makeReservation);
api.get('/property/approve-reservation/:id', PropertyController.approveReservation);
api.post('/property/:id/favorite', md_auth.ensureAuth, PropertyController.favoriteProperty);
api.get('/property/get-prices-range', PropertyController.getPricesRange);
api.get('/property/:userId/owned', md_auth.ensureAuth, PropertyController.findUserProperties);

api.post('/property/:id/make-review', md_auth.ensureAuth, md_property.validate('makeReview'), PropertyController.makeReview);

module.exports = api;