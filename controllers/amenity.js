'user strict'

const Amenity = require('../models/amenity');
const { validationResult } = require('express-validator');

function getAll(req, res) {
    Amenity.find()
        .exec()
        .then((amenitiesFound) => {
            res.status(200).send({ amenities: amenitiesFound });
        }).catch(err => {
            res.status(500).send({ message: 'No amenities found' });
        });
}

function saveAmenity(req, res) {
    try {
        validationResult(req).throw();

        var amenity = new Amenity();

        var params = req.body;
        console.log(params);
        amenity.name = params.name;
        amenity.enabled = params.enabled;
        if (amenity.name != null && amenity.enabled != null) {
            amenity.save((err, amenityStored) => {
                if (err) {
                    res.status(500).send({ message: 'Could not save amenity'});
                } else {
                    if (!amenityStored) {
                        res.status(404).send({ message: 'Could not save amenity' });

                    } else {
                        res.status(200).send({ amenity: amenityStored });
                    }
                }
            });
        } else {
            res.status(500).send({ message: 'Please, introduce all inputs' });
        }
    } catch (err) {
        // console.log(err.mapped());
        res.status(422).send({
            errors: err.mapped() // con llaves
                // errors: err.array() //sin llaves
        });
    }
}

module.exports = {
    getAll,
    saveAmenity
}