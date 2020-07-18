const mongoose = require('mongoose');
const User = require('./user');
const Bookings = require('./bookings');
const { static } = require('express');

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

/**
 * 
 * @param {Object} searchCriteria The one that is given to you by default is set to set everything to you
 * @param {Object} wantedField Se pasa el criterio de busqueda
 * @param {Number} num Query limiter
 */
apartmentSchema.statics.getAllApartments = async function (searchCriteria = {}, wantedField = {}, num = '') {
    return await this.find(searchCriteria, wantedField).populate('services').populate('comments.user_id').limit(num);
}

/**
 * 
 * It brings you all the apartments where ‘unsubscribeDate’ and ‘idBooking’ are not under siege
 * @param {Number} num Query limiter
 */
apartmentSchema.statics.getAllAvailableApartmentsForBooking = async function(num='') {
    return await this.find({$and:[{unsubscribeDate:''},{idBooking:''}]}).populate('services').populate('comments.user_id').limit(num);
}

/**
 * 
 * @param {Object} searchCriteria The one that is given to you by default is set to set everything to you
 * @param {Object} wantedField Se pasa el criterio de busqueda
 */
apartmentSchema.statics.getOneApartment = async function(searchCriteria = {}, wantedField = {}, num = '') {
    let apartments=  await this.getAllApartments(searchCriteria, wantedField,num);
    return apartments[0];
}


apartmentSchema.statics.apartmentBuilder = function(parameter) {

    let apartment = {

        title:parameter.title,
        description:parameter.description,
        terms:parameter.terms,
        rooms:parameter.rooms,
        squareMetres:parameter.squareMeters,
        location:{
            city:parameter.city,
            province:parameter.province,
            address:parameter.address,
            gps:[parameter.gps[0],parameter.gps[1]]
        },
        photos:[
            {
                title:parameter.mainPhoto,
                url:parameter['mainPhoto-url']
            },
            {
                title:parameter['title-photo-2'],
                url:parameter['photo-2']
            },
            {
                title:parameter['title-photo-3'],
                url:parameter['photo-3']
            },
            {
                title:parameter['title-photo-4'],
                url:parameter['photo-4']
            }
        ],
        services:[/* defined below */],
        price:parameter.price,
        durationMonths:parseInt(parameter.durationMonths),
        comments:[/* defined below */],
        unsubscribeUser:parameter.unsubscribeUser,
        unsubscribeDate:parameter.unsubscribeDate,
        registerUser:parameter.registerUser,
        registerDate:parameter.registerDate,
        idBooking:parameter.idBooking

    }

    for (let i = 0; i < parameter.photo.length; i++) {
        
        
    }

    

}


apartmentSchema.statics.getMaxPriceApartment = function(maxPrice) {
    return this.find().populate('services').where('price').lte(maxPrice);
}

exports.Apartment = mongoose.model('apartments', apartmentSchema, 'apartments');
mongoose.model('services', servicesSchema, 'services');