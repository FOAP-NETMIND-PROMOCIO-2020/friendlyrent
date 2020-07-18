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

//---------------------------CONSULT------------------------

/**
 * get all the apartments
 * @param {Object} searchCriteria The one that is given to you by default is set to set everything to you
 * @param {Object} wantedField Se pasa el criterio de busqueda
 * @param {Number} num Query limiter
 */
apartmentSchema.statics.getAllApartments = async function (searchCriteria = {}, wantedField = {}, num = '') {

    return await this.find(searchCriteria, wantedField).populate('services').populate('comments.user_id').limit(num);

}

/**
 * get all the apartments that are available
 * It brings you all the apartments where ‘unsubscribeDate’ and ‘idBooking’ are not under siege
 * @param {Number} num Query limiter
 */
apartmentSchema.statics.getAllAvailableApartmentsForBooking = async function(num='') {

    return await this.find({$and:[{unsubscribeDate:''},{idBooking:''}]}).populate('services').populate('comments.user_id').limit(num);

}

/**
 * get one the apartments
 * @param {Object} searchCriteria The one that is given to you by default is set to set everything to you
 * @param {Object} wantedField Se pasa el criterio de busqueda
 * @param {Number} num Query limiter
 */
apartmentSchema.statics.getOneApartment = async function(searchCriteria = {}, wantedField = {}, num = '') {

    let apartments=  await this.getAllApartments(searchCriteria, wantedField,num);
    return apartments[0];

}

/**
 * this functionality returns true if the user id that you have passed to been in that apartment
 * @param {String} idUser  id the User
 * @param {String} idApartament  id the apartament
 */
apartmentSchema.statics.canLeaveComment = async function(idUser,idApartament) {

    return ( await Bookings.findOne({idUser:idUser,idApartment:idApartament}))? true : false;

}

//---------------------------END CONSULT------------------------

//---------------------------INSERT------------------------

/**
 * creating a new apartment
 * @param {Object} fields apartment format object view database
 */
apartmentSchema.statics.createNewApartment = async function(fields) {

    let newApartment = new this(fields);
    return newApartment.save().catch(err => console.log('An error has occurred --> ',err))

}//not checked

//---------------------------END INSERT------------------------
//---------------------------MODIFY------------------------
/**
 * modify an apartment
 * @param {Object} searchCriteria The one that is given to you by default is set to set everything to you
 * @param {Object} parametersChange data to change or modify
 */
apartmentSchema.statics.upDateApartment = async function(searchCriteria,parametersChange) {

    return await this.updateOne(searchCriteria,parametersChange).catch(err => console.log('error: -> ', err))

}//not checked

/**
 * with this you can only insert one or many comments meeting the $ push criteria of mongoDB
 * @param {String} idApartament id of the apartment to which you want to make the modification
 * @param {Object} comment  you can pass a single comment as an object or multiple comments in a text string concatenating each object or comment with a comma ','
 */
apartmentSchema.statics.insertComment = async function (idApartament,comment) {

    return await this.upDateApartment({ _id:idApartament },{$push:{comments:comment}});

}//not checked , 80% seguridad

// ami criterio esto esta de mas de aqui abajo 

/**
 * with this functionality you can establish if an apartment is available or not
 * @param {String} idApartament id of the apartment to which you want to make the modification
 * @param {String} idBookings  id del contrato de alquiler
 */
apartmentSchema.statics.acceptsRentalRequest = async function(idApartament,idBookings = '') {

    return await this.upDateApartment({ _id:idApartament },{idBooking:idBookings});

}//not checked

//---------------------------END MODIFY------------------------

/**
 * get all the services
 * @param {Object} searchCriteria The one that is given to you by default is set to set everything to you
 * @param {Object} wantedField Se pasa el criterio de busqueda
 * @param {Number} num Query limiter
 */
servicesSchema.statics.getAllServices = async function(searchCriteria = {}, wantedField = {}, num = '') {

    return await this.find(searchCriteria, wantedField).limit(num);

}

exports.Apartment = mongoose.model('apartments', apartmentSchema, 'apartments');

exports.Services = mongoose.model('services', servicesSchema, 'services');