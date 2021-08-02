'use strict'

var Permission = require('../models/permission');

function pruebasPermission(req, res) {
    res.status(200).send({
        message: 'Probando una accion del controlador de usuarios del api rest raspi'
    });
}

function savePermission(req, res) {
    var permission = new Permission();
    var params = req.body;
    console.log(params);
    permission.name = params.name;

    permission.save((err, permissionStored) => {
        if (err) {
            res.status(500).send({ message: 'error al guardar permiso' });
        } else {
            if (!permissionStored) {
                res.status(404).send({ message: 'no se ha guardado el permiso' });
            } else {
                res.status(200).send({ permission: permissionStored });
            }
        }
    });
}
module.exports = {
    pruebasPermission,
    savePermission
};