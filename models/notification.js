'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notification = new Schema({
    usersDestination: Array,
    message: String,
    send: Boolean
},
    { timestamps: true, versionKey: false });

module.exports = mongoose.model('notification', notification);