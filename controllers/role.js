'use strict'

var Role = require('../models/role');
var Permission = require('../models/permission');

function pruebasRole(req, res) {
    res.status(200).send({
        message: 'Probando una accion del controlador de usuarios del api rest raspi'
    });
}

function addPermission(role, idPermission) {
    //role.permissions.push(element);
    return new Promise(resolve => {
        Permission.findOne({ _id: idPermission }, function(err, permission) {
            if (permission) {
                // console.log('permisos: ' + permission);
                console.log('role', role);
                role.permissions.push(idPermission);
                resolve(role);
            }
        });
    });
}

// await foreach es6
async function asyncForeach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        const element = array[index];
        await callback(element);
    }
}

async function saveRole(req, res) {
    var role = new Role();

    var params = req.body;
    // console.log(params);
    role.name = params.name;

    await asyncForeach(params.permissions, async(element) => {
        role = await addPermission(role, element);
    });

    console.log('role antes de guardar' + role);
    role.save((err, roleStored) => {
        if (err) {
            res.status(500).send({ message: 'error al guardar role' });
        } else {
            if (!roleStored) {
                res.status(404).send({ message: 'no se ha guardado el role' });
            } else {
                res.status(200).send({ role: roleStored });
                console.log('role guardado: ' + roleStored);
                // console.log('permisos guardados: ' + roleStored.permissions);
            }
        }
    });
}
module.exports = {
    pruebasRole,
    saveRole
};