const Apartment = require('../models/apartments').Apartment;
const Bookings = require('../models/bookings');
const moment = require('moment');

exports.getNewRental  =  async (req, res) => {
    const idApartment = req.params.idApartment;
    const apartment = await Apartment.getOneApartment({_id: idApartment});
    
    // Obtener fecha del sistema (la fecha de hoy): Pra que luego en el formulario sólo pueda escojer de la fecha de hoy para adelante
    var date = new Date();
    var month = date.getMonth() + 1;
    var day = date.getDate();

    if (month.toString().length < 2) {
        month = '0' + month;
    }
    if (day.toString().length < 2) { 
        day = '0' + day;
    }
    
    var currentDate = date.getFullYear() + "-" + month + "-" + day;


    res.render('newbooking', {
        apartment: apartment,
        currentDate: currentDate,
        userID: req.user._id
    });
}

exports.postNewRental = (req, res, next) => {
    const idApartmentHidden = req.body._idApartment;
    const idUserHidden = req.body._idUser;
    const rentalStartDate = req.body.rentalStartDate;
    const rentalTime = req.body.rentalTime;
    const rentalPrice = req.body.rentalPrice;
    
    // Obtener/Calcular la fecha de planificación de fin de contrato (Hemos tenido que instalar "moment")
        //PONERLO en los comentarios en el GidHub o como explicación en la wiki!!!!!!
        //https://momentjscom.readthedocs.io/en/latest/moment/03-manipulating/01-add/
        //https://stackoverflow.com/questions/39844746/moment-js-add-month-is-not-working/40601933
    const plannedDate = moment(rentalStartDate).add(rentalTime, 'M').format("YYYY-MM-DD");
    
    const newRental = new Bookings({
        idApartment: idApartmentHidden,
        price: rentalPrice,
        durationMonths: rentalTime,
        contractStartDate: rentalStartDate,
        contractEndPlannedDate: plannedDate,
        contractEndDate: null,
        reasonEndContract: null,
        idUser: idUserHidden,
        requestStatus: "pending"
    })
    
    newRental.save()
    .then( result => {
        res.send("Reserva insertada con éxito!");
        console.log("Reserva insertada:", result);
    })
    .catch ( err => {
        console.log("Error!!", err); 
        return next(err); // Es necesario este RETURN???????????
        //res.send("Ha ocurrido un error!!");     
    })
}