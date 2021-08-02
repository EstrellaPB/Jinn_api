'use strict'

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

//1. cargar rutas -ficheros
const user_routes = require('./routes/user');
const permission_routes = require('./routes/permission');
const role_routes = require('./routes/role');
const property_routes = require('./routes/property');
const currency_routes = require('./routes/currency');
const amenity_routes = require('./routes/amenity');


//2. configurar bodyParser- convertir a objetos json los datos que nos llegan por las peticiones http
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//3. configurar cabeceras http
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Authorization, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    next();
});
//4. carga de rutas base
app.use('/api', user_routes);
app.use('/api', permission_routes);
app.use('/api', role_routes);
app.use('/api', property_routes);
app.use('/api', currency_routes);
app.use('/api', amenity_routes);

//5. exportar modulo -ya podemos usar express dentro de otros ficheros que incluyan app
module.exports = app;