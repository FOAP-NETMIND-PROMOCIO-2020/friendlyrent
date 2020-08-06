const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bookingsSchema = new Schema({

    idApartment: {
        type: String,
        ref: 'apartments',
        // required: true
    },
    price: {
        type: Number,
        // required: true
    },
    durationMonths: {
        type: Number,
        // required: true
    },
    contractStartDate: {
        type: String,
        // required: true
    },
    contractEndPlannedDate: {
        type: String,
        // required: true
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

    }).populate('idUser');

    console.log("----------- que me sacas bookings + usuario", resultado);
    return resultado;
}

//----------------------------------------------------------------

bookingsSchema.statics.getOneBooking = async function (searchCriteria = {}, wantedField = {}, num = '') {

    let bookings = await this.getAllBookings(searchCriteria, wantedField, num);
    return bookings[0];

}

bookingsSchema.statics.setRequestStatusToPending = async function (searchCriteria = {}, wantedField = {}) {

    // localizar apartment por _id
    Apartment.getOneBooking(searchCriteria, wantedField);
    // cambiar el valor del campo requestStatus="Pending"
    Apartment.requestStatus = "Pending";
    // grabar en BBDD
    Apartment.save((err) => {
        if (err) { throw err; }
        return done(null, Apartment);
    });
}

bookingsSchema.statics.requestNewBooking = async function (idApartment) {

    // El controlador nos pasaräa todos los datos necesarios para crear 
    // el Booking 
    let newBooking = new this({idApartment: idApartment});
    newBooking.requestStatus = "pending";
    return newBooking.save().catch(err => console.log('An error has occurred --> ', err))

}//not checked


bookingsSchema.statics.getAllBookings = async function (searchCriteria = {}, wantedField = {}, num = '') {

    return await this.find(searchCriteria, wantedField); //.populate('services').populate('comments.user_id').limit(num);

}

bookingsSchema.statics.rejectRequest = async function (idBooking) {
    var targetBooking = await this.getOneBooking({ _id: idBooking });
    if (targetBooking.requestStatus == "pending") {
        console.log("targetBooking:", targetBooking);
        targetBooking.requestStatus = "rejected";
        targetBooking.save((err) => {
            if (err) { throw err; }
       
            console.log("Hemos cambiado el valor a rejected");
        });
    }
    console.log("no se puede cambiar status");
}

bookingsSchema.statics.setRequestStatusToAccept = async function (idBooking) {
    // localizar reserva de apartment por _id
    var targetBooking = await this.getOneBooking({ _id: idBooking });
    // cambiar el valor del campo requestStatus="Pending"
    targetBooking.requestStatus = "accepted";
    // grabar aceptado en BBDD
    await targetBooking.save( function(err) {
        if (err) { throw err; }
        console.log("Hemos cambiado el valor a accepted", targetBooking.idApartment);
        
    });

    setRequestStatusToRejected (targetBooking.idApartment);


}

bookingsSchema.statics.setRequestStatusToRejected = async function (idApartment) {
const filter = {$and:[{idApartment: idApartment}, { requestStatus: "pending" }]};
console.log(filter);
let x = await this.updateMany(filter, {requestStatus: "rejected"}).catch(err=>{
    console.log("Error", err)
});

console.log("grabado", x);

}
//------------------------------------------------------------------




module.exports = mongoose.model('bookings', bookingsSchema, 'bookings');