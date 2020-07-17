const mongoose = require('mongoose');
const User = require('./user');
const Bookings = require('./bookings');

const Schema = mongoose.Schema;

const locationSchema = Schema({
    city: String,
    province: String,
    adress: String,
    gps: [String]
})

const photoSchema = Schema({
    _id: false,
    title: String,
    url: String
})

const commentsSchema = Schema({
    _id: false, 
    comment: String,
    user_id: {
        type: String, 
        ref: 'user'},
    createDate: String
})

const apartmentSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    terms: {
        type: String,
        required: false
    },
    rooms: {
        type: Number,
        required: true
    },
    bathrooms: {
        type: Number,
        required: true
    },
    squareMeters: {
        type: Number,
        required: true
    },
    location: {
        type: {locationSchema}, // Tipo Objeto
        required: true
    },
    photos: {
        type: [photoSchema],    // Array de objetos
        required: true
    },
    services: [{
        type: [String],     // Forma de declarar un Array con Strings dentro
        ref: 'services',
        required: true
    }],
    price: {
        type: Number,
        required: true
    },
    durationMonths: {
        type: Number,
        required: true
    },
    comments: {
        type: [commentsSchema],    // Array de objetos
        required: false
    },
    unsubscribeUser: {
        type: String,
        ref: 'user',
        required: false
    },
    unsubscribeDate: {
        type: String,
        required: false
    },
    registerUser: {
        type: String,
        ref: 'user',
        required: false
    },
    registerDate: {
        type: String,
        required: false
    },
    idBooking: {
        type: String,
        ref: 'bookings',
        required: true
    }
})

// Colección de Servicios
const servicesSchema = new Schema({
    codeService: {
        type: String,
        required: true
    },
    iconService: {
        type: String,
        required: true
    }
})

exports.Apartment = mongoose.model('apartments', apartmentSchema, 'apartments');
mongoose.model('services', servicesSchema, 'services');