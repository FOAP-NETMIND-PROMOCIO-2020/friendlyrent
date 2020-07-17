const mongoose = require('mongoose');
const User = require('./user');
const Apartment = require('./apartments');

const Schema = mongoose.Schema;

const bookingsSchema = new Schema({
    idApartment: {
        type: String,
        ref: 'apartments',
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    durationMonths: {
        type: Number,
        required: true
    },
    contractStartDate: {
        type: String,
        required: true
    },
    contractPlannedDate: {
        type: String,
        required: true
    },
    contractEndDate: {
        type: String,
        required: false
    },
    reasonEndContract: {
        type: String,
        required: false
    },
    idUser: {
        type: String,
        ref: 'user',
        required: true
    }
})

module.exports = mongoose.model('bookings', bookingsSchema, 'bookings');