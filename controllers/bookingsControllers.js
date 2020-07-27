//const Bookings = require('../models/bookings');

exports.getNewRental  =  (req, res) => {
    res.render('newbooking');
}

exports.postNewRental = (req, res) => {
    // const rentalStartDate = req.body.rentalStartDate;
    // const rentalTime = req.body.rentalTime;
    // const rentalPrice = req.body.rentalPrice;

    // const newRental = new Bookings({
    //     rentalStartDate: rentalStartDate,
    //     rentalTime: rentalTime,
    //     rentalPrice: rentalPrice
    // })
    res.send("Petición de alquiler enviada");
    console.log("----------------------------------req.body-----------------------------", req.body);
    // newRental.save()
    // .then( result => {
    //     res.send("Reserva insertada con éxito!");
    //     console.log("Apartamento insertado:", result);
    // })
    // .catch ( err => {
    //     console.log("Error!!", err); 
    //     res.send("Ha ocurrido un error!!");     
    // })
}