'user strict'

var express = require('express');
var CurrencyController = require('../controllers/currency');

var api = express.Router();

// middlewares
var md_auth = require('../middlewares/authenticated');
var md_currency = require('../middlewares/currencyValidated');
var md_permit = require('../middlewares/permitted');


// creando rutas
api.get('/currency/get-all', md_auth.ensureAuth, CurrencyController.getAll);
api.post('/currency', md_auth.ensureAuth, md_permit.permit('saveCurrency'), CurrencyController.saveCurrency);

module.exports = api;