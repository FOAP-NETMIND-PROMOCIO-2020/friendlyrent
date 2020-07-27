const mongoose = require('mongoose');
const User = require('./user');
const Apartment = require('./apartments')


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
    },
    requestStatus: {
        type: String,
        required: true,
        enum: ["accepted", "rejected", "pending"]
    }
})
//---------------------------CONSULT------------------------

/**
 * get all the apartments
 * @param {ObjectId} id id usuario
 */

bookingsSchema.statics.getAllApartmentsUsr = async function (id) {
    let results = await this.find({ idUser: id }).populate('idApartment');
    console.log("que me sacas DE INQUILINMO", results);

    return results;
}

// MENSAJES
// Ver si puede insertar comentario, OWNER SOBRE CUSTOMER
bookingsSchema.statics.writetMessagesToF = async function (idOwner, idCustomer) {

    let results = await this.findOne({ idUser: idCustomer }, {requestStatus: "accepted"}).populate({
        path: 'idApartment',
        match: { registerUser: idOwner }
        // ,        select: 'description -_id'
    });
    console.log("Encontrado", results);
    if (results == null || results.idApartment == null) {
        return false
    } else {
        return true;
    }
}


// FIN MENSAJES

bookingsSchema.statics.getAllApartmentsUsrAnt = async function (id) {

    let resultado = await this.find({ idUser: id }).populate('idUser').populate('idApartment');
    console.log("que me sacas", resultado);
    return resultado;
}

// CONSULTA DETODAS LAS RESERVAS DE UN APARTAMENTO POR PROPIETARIO
/**
 * get all the apartments
 * @param {ObjectId} id id usuario
 */

bookingsSchema.statics.getAllApartmentsOwn = async function (id) {

    let resultado = await this.find().sort({idApartment:1}).populate({
        path: 'idApartment',
        match: { registerUser: id }
        // ,        select: 'description -_id'
    });
    console.log("que me sacas bookings", resultado);
    return resultado;
}

module.exports = mongoose.model('bookings', bookingsSchema, 'bookings');