'use strict'

var Lecture = require('../models/lecture');

function pruebas(req, res) {
    res.status(200).send({
        message: 'Probando una accion del controlador de usuarios del api rest raspi'
    });
}

function saveLecture(req, res) {
    var lecture = new Lecture();
    var params = req.body;
    console.log(params);
    lecture.mac_address = params.mac_address;
    lecture.vib_sensor_data = params.vib_sensor_data;
    lecture.pow_sensor_data = params.pow_sensor_data;

    lecture.save((err, lectureStored) => {
        if (err) {
            res.status(500).send({ message: 'error al guardar lectura' });
        } else {
            if (!lectureStored) {
                res.status(404).send({ message: 'no se ha guardado la lectura' });
            } else {
                res.status(200).send({ lecture: lectureStored });
            }
        }
    });
}

function findLectures(req, res) {
    Lecture.find().
    exec().
    then((Lectures) => {
        res.status(200).send({ lectures: Lectures });
    }).
    catch(err => {
        res.status(500).send({ message: 'Something went wrong' });
    });
}

function findLectureById(req, res) {
    var lectureId = req.params.id;
    Lecture.findById(lectureId).
    exec().
    then((Lecture) => {
        res.status(200).send({ lecture: Lecture });
    }).
    catch(err => {
        res.status(500).send({ message: 'Something went wrong' });
    });
}

function deleteLecture(req, res) {
    var lectureId = req.params.id;
    Lecture.deleteOne({ _id: lectureId }, (err) => {
        if (err) {
            res.status(500).send({ message: 'Something went wrong' });
        } else {
            res.status(200).send({ message: 'Lecture was eliminated succesfully' });
        }
    })
}
module.exports = {
    pruebas,
    saveLecture,
    findLectures,
    findLectureById,
    deleteLecture
};