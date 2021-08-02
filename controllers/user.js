'user strict'

var bcrypt = require('bcryptjs');
var User = require('../models/user');
var Role = require('../models/role');
var jwt = require('../services/jwt');
var { transporter, getPasswordResetURL, resetPasswordTemplate } = require('../services/node-mailer');
var moment = require('moment');
const fs = require('fs');
const path = require('path');

const { validationResult } = require('express-validator');

function pruebas(req, res) {
    res.status(200).send({
        message: 'Probando una accion del controlador de usuarios del api rest con node y mongo'
    });
}

function saveUser(req, res) {
    try {
        validationResult(req).throw();

        var user = new User();

        var params = req.body;
        console.log(params);
        user.name = params.name;
        user.surname = params.surname;
        user.email = params.email;
        user.image = 'null';


        if (params.password == params.confirmPassword) {
            //encriptar contraseña y guardar datos
            bcrypt.hash(params.password, 10, function(err, hash) {
                user.password = hash;
                console.log(hash);
                if (user.name != null && user.surname != null && user.email != null) {
                    //guardar usuario
                    Role.findById(params.role, function(err, role) {
                        if (role) {
                            user.role = role._id;
                            user.save((err, userStored) => {
                                if (err) {
                                    res.status(500).send({ message: 'error al guardar el usuario' });
                                } else {
                                    if (!userStored) {
                                        res.status(404).send({ message: 'no se ha registrado el usuario' });

                                    } else {
                                        res.status(200).send({ user: userStored });
                                    }
                                }
                            });
                        }
                    });
                } else {
                    res.status(200).send({ message: 'introduce todos los campos' });

                }
            })
        } else {
            res.status(500).send({ message: 'introduce la contraseña' });
        }
    } catch (err) {
        // console.log(err.mapped());
        res.status(422).send({
            errors: err.mapped() // con llaves
                // errors: err.array() //sin llaves
        });
    }
}

function loginUser(req, res) {
    try {
        validationResult(req).throw();
        var params = req.body;
        var email = params.email;
        var password = params.password;

        User.findOne({ email: email.toLowerCase() }, (err, user) => {
            if (err) {
                res.status(500).send({ message: 'error en la petición' });
            } else {
                if (!user) {
                    res.status(404).send({ message: 'el usuario no existe' });
                } else {
                    //comprobar la contraseña
                    bcrypt.compare(password, user.password, function(err, check) {
                        if (check) {
                            //devolver datos del usuario logueado
                            if (params.gethash) {
                                //devolver token de jwt
                                res.status(200).send({
                                    token: jwt.createToken(user)
                                });
                            } else {
                                res.status(200).send({ user });
                            }
                        } else {
                            res.status(404).send({ message: 'el usuario no ha podido loguearse' });
                        }
                    });
                }
            }
        });
    } catch (err) {
        // console.log(err.mapped());
        res.status(422).send({
            errors: err.mapped() // con llaves
                // errors: err.array() //sin llaves
        });
    }
}

function findUserById(req, res) {
    var userId = req.params.id;
    User.findById(userId)
        .exec()
        .then((userFound) => {
            res.status(200).send({ user: userFound });
        }).catch(err => {
            res.status(500).send({ message: 'User not found' });
        });
}

function findFavorites(req, res) {
    var userId = req.params.id;
    User.findById(userId)
        .populate('favorites')
        .select('favorites')
        .exec()
        .then((userFound) => {
            res.status(200).send({ user: userFound });
        }).catch(err => {
            res.status(500).send({ message: 'No favorites found' });
        })
}

function findUsers(req, res) {
    if (req.query['page']) {
        var page = req.query['page'];
    } else {
        var page = 1;
    }
    var itemsPerPage = 10;
    // var userId = req.params.id;
    User.find()
        .populate('role')
        .paginate(page, itemsPerPage, function(err, users, total){
            if (err) {
                res.status(500).send({ message: 'Something went wrong' });
            } else {
                if (!users) {
                    res.status(404).send({ message: 'No results' });
                } else {
                    return res.status(200).send({
                        total: total,
                        perPage: itemsPerPage,
                        users: users
                    })
                }
            }
        })
}

async function profileUser(req, res) {
    var user = await User.findById(req.user.sub).exec();
    try {
        res.status(200).send({ user: user });
    } catch (error) {
        res.status(500).send({ message: 'User not found' });
    }
}

function updateProfileUser(req, res) {
    try {
        validationResult(req).throw();
        var userId = req.user.sub;
        var update = {
                name: req.body.name,
                surname: req.body.surname,
                email: req.body.email,
                image: req.body.image
            }
            // if (update.password) {
            //     update.password = await User.hashPassword(update.password);
            // }
        User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
            if (err) {
                res.status(500).send({ message: 'Error al actualizar el usuario' });
            } else {
                if (!userUpdated) {
                    res.status(404).send({ message: 'No se ha podido actualizar el usuario' });
                } else {
                    console.log(userUpdated);
                    res.status(200).send({ user: userUpdated });

                    User.findById(userId, (err, user) => {
                        console.log('usuarioactualizado :' + user);
                    });

                }
            }
        });
    } catch (err) {
        // console.log(err.mapped());
        res.status(422).send({
            errors: err.mapped() // con llaves
                // errors: err.array() //sin llaves
        });
    }
}
async function updateUser(req, res) {
    try {
        validationResult(req).throw();
        var userId = req.params.id;
        var update = req.body;
        // if (update.password) {
        //     update.password = await User.hashPassword(update.password);
        // }
        User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
            if (err) {
                res.status(500).send({ message: 'Error al actualizar el usuario' });
            } else {
                if (!userUpdated) {
                    res.status(404).send({ message: 'No se ha podido actualizar el usuario' });
                } else {
                    console.log(userUpdated);
                    res.status(200).send({ user: userUpdated });

                    User.findById(userId, (err, user) => {
                        console.log('usuarioactualizado :' + user);
                    });

                }
            }
        });
    } catch (err) {
        // console.log(err.mapped());
        res.status(422).send({
            errors: err.mapped() // con llaves
                // errors: err.array() //sin llaves
        });
    }
}

async function userPasswordReset(req, res) {
    try {
        validationResult(req).throw();
        var userId = req.params.id;
        var update = req.body;
        console.log('passs' + update.password);
        console.log('confirmpasss' + update.confirmPassword);
        if (update.password == update.confirmPassword) {
            update.password = await User.hashPassword(update.password);

            User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
                if (err) {
                    res.status(500).send({ message: 'Error al actualizar contraseña' });
                } else {
                    if (!userUpdated) {
                        res.status(404).send({ message: 'No se ha podido actualizar la contraseña' });
                    } else {
                        console.log(userUpdated);
                        res.status(200).send({ user: userUpdated });

                        User.findById(userId, (err, user) => {
                            console.log('usuarioactualizado :' + user);
                        });

                    }
                }
            });
        }
    } catch (err) {
        // console.log(err.mapped());
        res.status(422).send({
            errors: err.mapped() // con llaves
                // errors: err.array() //sin llaves
        });
    }
}

function deleteUser(req, res) {
    var userId = req.params.id;
    User.deleteOne({ _id: userId }, (err) => {
        if (err) {
            res.status(500).send({ message: 'Error al eliminar al usuario' });
        } else {
            res.status(200).send({ message: 'Usuario eliminado con exito' });
        }
    });
}
//  RESET PASSWORD
async function sendPasswordResetEmail(req, res) {
    try {
        var user = await User.findById(req.user.sub).exec();
        // console.log(user);
        var data = {
            userId: user._id,
            password: user.password,
            createdAt: user.createdAt
        }
        var token = jwt.createResetPasswordToken(data.userId, data.password, data.createdAt);
        var url = getPasswordResetURL(user, token);
        var emailTemplate = resetPasswordTemplate(user, url);
        // var sendEmail = () => {
        transporter.sendMail(emailTemplate, (err, info) => {
            if (err) {
                res.status(500).send({ message: "Error sending email" });
            }
            res.status(200).send({ message: 'Email sent' })
            console.log(`** Email sent **`, info.response)
        });
        // }
        // sendEmail();
    } catch (error) {
        res.status(500).send({ message: "Error sending email" });
    }

}

function saveNewPassword(req, res) {
    var { userId, token } = req.params
    var update = req.body
        // highlight-start

    User.findById(userId).exec()
        .then(async(user) => {
            var payload = jwt.readResetPasswordToken(user.password, user.createdAt, token);
            console.log("expiration" + payload.exp);
            console.log("now" + moment().unix());


            if (payload.sub === user.id && (payload.exp >= moment().unix())) {
                if (update.password != null && update.confirmPassword != null && update.password == update.confirmPassword) {
                    update.password = await User.hashPassword(update.password);
                    console.log("password hash " + update.password);
                    User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
                        if (err) {
                            res.status(500).send({ message: 'Error al actualizar contraseña' });

                        } else {
                            if (!userUpdated) {
                                res.status(404).send({ message: 'No se ha podido actualizar la contraseña' });
                            } else {
                                console.log(userUpdated);
                                res.status(200).send({ user: userUpdated });

                                User.findById(userId, (err, user) => {
                                    console.log('usuarioactualizado :' + user);
                                });

                            }
                        }
                    });

                } else {
                    res.status(500).send({ message: "Something went wrong" });
                }
            }

        }).catch(err => {
            res.status(404).send({ message: "Something went wrong" });
        });
}

function uploadImage(req, res) {
    var userId = req.params.id;
    var file_name = 'No-data';

    if (req.files) {
        var file_path = req.files.image.path;
        var file_name = path.basename(file_path);
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
            User.findByIdAndUpdate(userId, { image: file_name }, (err, userUpdated) => {
                if (!userUpdated) {
                    res.status(404).send({ message: 'Could not update user' });
                } else {
                    res.status(200).send({ user: userUpdated });
                }
            });
        } else {
            res.status(200).send({ message: 'File not valid' });
        }
    } else {
        res.status(200).send({ message: 'No image has been uploaded' });
    }
}

function getImageFile(req, res) {
    var imageFile = req.params.imageFile;
    var pathFile = './uploads/users/' + imageFile;
    fs.exists(pathFile, function(exists) {
        if (exists) {
            res.sendFile(path.resolve(pathFile));
        } else {
            var pathDefaultFile = './uploads/user-default.png';
            res.sendFile(path.resolve(pathDefaultFile));
        }
    });
}

function logout(req, res) {
    res.status(200).send({ message: 'Logged out' });
}

module.exports = {
    pruebas,
    saveUser,
    loginUser,
    profileUser,
    updateProfileUser,
    updateUser,
    userPasswordReset,
    findUserById,
    findFavorites,
    findUsers,
    deleteUser,
    sendPasswordResetEmail,
    saveNewPassword,
    uploadImage,
    getImageFile,
    logout
}