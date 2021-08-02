'user strict'

var express = require('express');
var UserController = require('../controllers/user');

var api = express.Router();
const multipart = require('connect-multiparty');

// middlewares
const md_auth = require('../middlewares/authenticated');
const md_user = require('../middlewares/userValidated');
const md_permit = require('../middlewares/permitted');
const md_upload = multipart({ uploadDir: './uploads/users' });

//creando ruta

api.get('/probando-controlador', md_auth.ensureAuth, md_permit.permit('view.user'), UserController.pruebas);

api.post('/login', md_user.validate('loginUser'), UserController.loginUser);
api.post('/register', md_user.validate('saveUser'), UserController.saveUser);
api.post('/logout', md_auth.ensureAuth, UserController.logout);


api.get('/user', md_auth.ensureAuth, md_permit.permit('view.user'), UserController.findUsers);
api.get('/user/:id', md_auth.ensureAuth, md_permit.permit('view.user'), UserController.findUserById);
api.get('/user/:id/favorites', md_auth.ensureAuth, UserController.findFavorites);
api.post('/user/:id/update', md_auth.ensureAuth, md_permit.permit('edit.user'), md_user.validate('updateUser'), UserController.updateUser);
api.get('/user/:id/delete', md_auth.ensureAuth, md_permit.permit('delete.user'), UserController.deleteUser);
api.post('/password-reset/:id', md_permit.permit('edit.user'), md_user.validate('userPasswordReset'), UserController.userPasswordReset);


api.get('/profile', md_auth.ensureAuth, UserController.profileUser);
api.post('/update-profile', md_auth.ensureAuth, UserController.updateProfileUser);
api.post('/user/:id/upload-image', md_auth.ensureAuth, md_upload, UserController.uploadImage);
api.get('/user/get-image/:imageFile', UserController.getImageFile);


api.get('/send-email', md_auth.ensureAuth, UserController.sendPasswordResetEmail);
api.post('/reset-password/:userId/:token', UserController.saveNewPassword);
module.exports = api;