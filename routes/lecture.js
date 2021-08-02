'use strict'

var express = require('express');
var LectureController = require('../controllers/lecture');

//cargar router de express
var api = express.Router();

// api.get('/probando-controlador', LectureController.pruebas);
api.post('/save-lecture', LectureController.saveLecture);
api.get('/find-lectures', LectureController.findLectures);
api.get('/find-lecture/:id', LectureController.findLectureById);
api.get('/delete-lecture/:id', LectureController.deleteLecture);

module.exports = api;