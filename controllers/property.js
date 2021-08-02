'user strict'
const fs = require('fs');
const path = require('path');
const Property = require('../models/property');
const Amenity = require('../models/amenity');
const Currency = require('../models/currency');
const Reservation = require('../models/reservation');
const User = require('../models/user');
const { validationResult } = require('express-validator');
var { transporter, getApproveReservationUrl, reservationBookTemplate } = require('../services/node-mailer');
var mongoosePaginate = require('mongoose-pagination');

async function getAll(req, res) {
    var query = req.query;
    var propertiesfilters = {};
    var reservationFilters = {};
    var sortBy = {};
    for (const q_attr in query) {
        if (query.hasOwnProperty(q_attr)) {
            switch (q_attr) {
                case 'maxGuests':
                    if (parseInt(Math.abs(query[q_attr])) > 0) {
                        propertiesfilters[q_attr] = {
                            $lte: parseInt(Math.abs(query[q_attr]))
                        }
                    }
                    break;
                case 'address':
                    propertiesfilters[q_attr] = {
                        $regex: '.*' + query[q_attr] + '.*'
                    }
                    break;
                case 'price':
                    if (parseInt(Math.abs(query[q_attr][0])) > 0) {
                        propertiesfilters[q_attr] = {
                            $gte: parseInt(Math.abs(query[q_attr][0])),
                            $lte: parseInt(Math.abs(query[q_attr][1]))
                        }
                    }
                    break;
                case 'popular':
                    sortBy = {
                        skip:0, // Starting Row
                        limit:5, // Ending Row
                        sort:{
                            stars: -1 //Sort by Stars DESC
                        }
                    }
                    break;
                case 'dates':
                    reservationFilters[q_attr] = query[q_attr];
                    break;
                default:
                    break;
            }
        }
    }

    var propertiesFound = {};

    if (Object.keys(propertiesfilters).length > 0 && Object.keys(sortBy).length > 0) {
        propertiesFound = await Property.find(propertiesfilters, null, sortBy).populate('amenities.amenity').populate('currency').exec();
    } else if(Object.keys(propertiesfilters).length > 0) {
        propertiesFound = await Property.find(propertiesfilters).populate('amenities.amenity').populate('currency').exec();
    } else if(Object.keys(sortBy).length > 0) {
        propertiesFound = await Property.find({}, null, sortBy).populate('amenities.amenity').populate('currency').exec();
    } else {
        propertiesFound = await Property.find().populate('amenities.amenity').populate('currency').exec();
    }

    var reservationsFound = {};
    if (!!reservationFilters && reservationFilters.length > 0) {
        const datesSplit = reservationFilters.dates.split(' - ');
        const startDate = datesSplit[0];
        const endDate = datesSplit[1];
        reservationsFound = await Reservation.find({ 
            match: { 
                dateBegin: { $gt: startDate, $lt: endDate },
                dateEnd: { $gt: startDate, $lt: endDate } 
            }
        });
    }

    
    res.status(200).send({ properties: propertiesFound, reservationsFound: reservationsFound });
}

function findUserProperties(req, res) {
    var ownerId = req.params.userId;
    if (req.query['page']) {
        var page = req.query['page'];
    } else {
        var page = 1;
    }
    var itemsPerPage = 5;
    Property.find({ homeowner: ownerId })
            .populate('currency')
            .paginate(page, itemsPerPage, function(err, properties, total){
                if (err) {
                    res.status(500).send({ message: 'Something went wrong' });
                } else {
                    if (!properties) {
                        res.status(404).send({ message: 'No results' });
                    } else {
                        return res.status(200).send({
                            total: total,
                            perPage: itemsPerPage,
                            properties: properties
                        })
                    }
                }
            })
}

function findPropertyById(req, res) {
    var propertyId = req.params.id;
    Property.findById(propertyId)
        .populate('homeowner')
        .populate('amenities.amenity')
        .exec()
        .then((propertyFound) => {
            res.status(200).send({ property: propertyFound });
        }).catch(err => {
            res.status(500).send({ message: 'Property not found' });
        });
}

async function getPricesRange(req, res) {
    var min = 0;
    var max = 10000;
    var sortByMin = {
        skip:0,
        limit:1,
        sort:{
            price: 1
        }
    }
    var sortByMax = {
        skip:0,
        limit:1,
        sort:{
            price: -1
        }
    }
    await Property.find({}, null, sortByMin).exec().then(function(err, doc) {
        if (!err) {
            min: doc.price;
        }
    });

    await Property.find({}, null, sortByMax).exec().then(function(err, doc) {
        if (!err) {
            max: doc.price;
        }
    });
    res.status(200).send({ priceMin: min, priceMax: max });
}

function saveProperty(req, res) {
    try {
        validationResult(req).throw();

        var property = new Property();

        var params = req.body;
        property.title = params.title;
        property.description = params.description;
        property.enabled = params.enabled;
        property.maxGuests = params.maxGuests;
        property.homeowner = params.homeowner;
        property.price = params.price;
        property.amenities = params.amenities;
        property.location = params.location;
        if (property.title != null && property.description != null) {
            Currency.findById(params.currency, function(err, curr) {
                if (curr) {
                    property.currency = curr._id;
                    property.save((err, propertyStored) => {
                        if (err) {
                            console.log(err);
                            res.status(500).send({ message: 'Could not save property'});
                        } else {
                            if (!propertyStored) {
                                res.status(404).send({ message: 'could not save property' });

                            } else {
                                res.status(200).send({ property: propertyStored });
                            }
                        }
                    });
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

async function updateProperty(req, res) {
    try {
        validationResult(req).throw();
        var propertyId = req.params.id;
        var update = req.body;
        
        Property.findByIdAndUpdate(propertyId, update, (err, propertyUpdated) => {
            if (err) {
                res.status(500).send({ message: 'An error ocurred' });
            } else {
                if (!propertyUpdated) {
                    res.status(404).send({ message: 'Could not update property' });
                } else {
                    Property.findById(propertyUpdated._id).then(function(property) {
                        res.status(200).send({ property: property });
                    });
                }
            }
        });
    } catch (err) {
        res.status(422).send({
            errors: err.mapped() // con llaves
                // errors: err.array() //sin llaves
        });
    }
}

async function makeReview(req, res) {
    try {
        validationResult(req).throw();
        var propertyId = req.params.id;
        var reviewBody = req.body;

        Property.findById(propertyId).then( (propertyFound) => {
            propertyFound.reviews.push(reviewBody);
            var reviewStars = reviewBody.stars;
            propertyFound.stars = (propertyFound.stars + reviewStars) / property.reviews.length;
            propertyFound.save();
            res.status(200).send({ message: 'The review has been saved' });
        } );
    } catch (error) {
        res.status(500).send({ message: 'Could not save review' });
    }
}

async function favoriteProperty(req, res) {
    const propertyId = req.params.id;
    const userId = req.user.sub;

    const property = await Property.findById(propertyId).exec();
    User.findById(userId)
        .exec()
        .then(userFound => {
            userFound.favorites.push(property._id);
            userFound.save((err, userStored) => {
                if (err) {
                    res.status(500).send({ message: 'Could not add favorite' });
                } else {
                    res.status(200).send({ user: userStored, favorite: property });
                }
            });
        })
        .catch(err => {
            res.status(500).send({ message: 'Could not add favorite' })
        });
}

async function deleteImage(req, res) {
    var propertyId = req.params.id;
    var imageFile = req.params.imageFile;
    var pathFile = './uploads/properties/' + imageFile;
    fs.exists(pathFile, function(exists) {
        if (exists) {
            Property.findById(propertyId).exec().then((found)=>{
                try {
                    var imageFound = found.images.find((element) => element.name == imageFile);

                    if (imageFound) {
                        fs.unlinkSync(pathFile);
                        found.images.pull({ _id: imageFound._id });
                        found.save();
                        res.status(200).send({ message: 'Image deleted' })
                    }
                } catch(err) {
                    res.status(404).send({ message: 'Image not found' });
                }
            });
            
        } else {
            res.status(404).send({ message: 'Image not found' });
        }
    });
}

async function uploadImage(req, res) {
    var propertyId = req.params.id;
    var file_name = 'No-data';

    if (req.files) {
        var file_path, file_name, ext_split, file_ext;
        if (Array.isArray(req.files.image)) {
            req.files.image.forEach( async (element) => {
                file_path = element.path;
                file_name = path.basename(file_path);
                ext_split = file_name.split('\.');
                file_ext = ext_split[1];
        
                if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
                    var property = await Property.findById(propertyId).exec();
                    if (!property) {
                        res.status(404).send({ message: 'Could not update property' });
                    } else {
                        property.images.push({name: file_name});
                        property.save((err, propStored) => {
                            if (err) {
                                res.status(500).send({ message: 'Error ocurred while saving property' });
                            } else {
                                if (!propStored) {
                                    res.status(404).send({ message: 'Could not save property' });
        
                                } else {
                                    res.status(200).send({ property: propStored })
                                }
                            }
                        });
                    }
                } else {
                    res.status(200).send({ message: 'File not valid' });
                }
            });
        } else {
            file_path = req.files.image.path;
            file_name = path.basename(file_path);
            ext_split = file_name.split('\.');
            file_ext = ext_split[1];
    
            if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
                var property = await Property.findById(propertyId).exec();
                if (!property) {
                    res.status(404).send({ message: 'Could not update property' });
                } else {
                    property.images.push({name: file_name});
                    property.save((err, propStored) => {
                        if (err) {
                            res.status(500).send({ message: 'Error ocurred while saving property' });
                        } else {
                            if (!propStored) {
                                res.status(404).send({ message: 'Could not save property' });
    
                            } else {
                                res.status(200).send({ property: propStored })
                            }
                        }
                    });
                }
            } else {
                res.status(200).send({ message: 'File not valid' });
            }
        }
    } else {
        res.status(200).send({ message: 'No image has been uploaded' });
    }
}

function getImageFile (req, res) {
    var imageFile = req.params.imageFile;
    var pathFile = './uploads/properties/' + imageFile;
    fs.exists(pathFile, function(exists) {
        if (exists) {
            res.sendFile(path.resolve(pathFile));
        } else {
            var pathDefaultFile = './uploads/property-default.svg';
            res.sendFile(path.resolve(pathDefaultFile));
        }
    });
}

async function makeReservation (req, res) {
    try {
        validationResult(req).throw();
        const body = req.body;
        const property = Property.findById(req.params.id);

        var reservation = new Reservation;
        reservation.property = body.property;
        reservation.dateBegin = body.dateBegin;
        reservation.dateEnd = body.dateEnd;
        reservation.guests = body.guests;
        reservation.user = body.user;

        reservation.save(async (err, reservationMade) => {
            if (err) {
                console.log(err);
                res.status(500).send({ message: 'Error ocurred while saving reservation' });
            } else {
                if (!reservationMade) {
                    res.status(404).send({ message: 'Could not save reservation' });
                } else {
                    var user = await User.findById(req.user.sub).exec();
                    var url = getApproveReservationUrl(reservationMade);
                    var emailTemplate = reservationBookTemplate(user, reservationMade, url);
                    transporter.sendMail(emailTemplate, (err, info) => {
                        if (err) {
                            res.status(500).send({ message: "Error sending email" });
                        }
                        res.status(200).send({ reservation: reservationMade })
                        console.log(`** Email sent **`, info.response)
                    });
                }
            }
        });
    } catch (err) {
        res.status(422).send({
            errors: err.mapped()
        });
    }
}

async function approveReservation(req, res) {
    try {
        var reservationId = req.params.id;
        var reservation = await Reservation.findById(reservationId).exec();
        if (reservation) {
            reservation.approved = true;
            reservation.save();
            res.status(200).send({ message: 'Reservation approved' });
        }
    } catch (error) {
       res.status(500).send({ message: 'Error, reservation not approved' }); 
    }
}

function deletePropertyByOwner(req, res) {
    var propertyId = req.params.id;
    Property.findById(propertyId)
        .exec()
        .then((propertyFound) => {
            if (propertyFound.homeowner == req.user.sub) {
                Property.deleteOne({ _id: propertyFound._id }, (err) => {
                    if (err) {
                        res.status(500).send({ message: 'Error' });
                    } else {
                        res.status(200).send({ message: 'Property deleted' });
                    }
                });
            } else {
                res.status(403).send({ message: 'Unauthorized!' });
            }
        }).catch(err => {
            res.status(500).send({ message: 'Property not found' });
        });
    
}

module.exports = {
    getAll,
    findPropertyById,
    getPricesRange,
    saveProperty,
    updateProperty,
    makeReview,
    uploadImage,
    getImageFile,
    deleteImage,
    makeReservation,
    favoriteProperty,
    findUserProperties,
    deletePropertyByOwner,
    approveReservation
}