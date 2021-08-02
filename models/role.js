'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//objeto de tipo esquema

var RoleSchema = Schema({
    name: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 100
    },
    permissions: [{ type: Schema.Types.ObjectId, ref: 'Permission' }]
}, { timestamps: true });

module.exports = mongoose.model('Role', RoleSchema);