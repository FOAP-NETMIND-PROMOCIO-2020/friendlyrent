const Apartment = require('../models/apartments').Apartment

//endpoint --> /
exports.getAllApartments = async(req, res) => {

    let apartments = await Apartment.getAllApartments();
    //
    console.log('--------------------******----------------------------HOLAAAAAA---------------*********---------------- ',apartments);

    res.render('index', {
        role: 'inquilino'
    });
}

//endpoint --> /post-register-new-user
exports.postSignUp = (req, res) => {
    let parameters = req.body;
    console.log("valor de parameters --> ", parameters)
    parameters = JSON.stringify(parameters);

    res.render('index', {
        role: 'inquilino'
    });
}

//endpoint --> /new-apartment
exports.getNewApartment = (req, res) => {
    const services = [{
        label: "WiFi",
        value: "wifi"
    }, 
    {
        label: "TV",
        value: "tv"
    },
    {
        label: "AC",
        value: "ac"
    }, 
    {
        label: "WC",
        value: "wc"
    }, 
    {
        label: "Kitchen",
        value: "kitchen"
    }]

    res.render('new-apartment', {
        services: services
    });
}

//endpoint --> /new-apartment
exports.postNewApartment = (req, res) => {
    res.send("Hemos recibido los datos del apartamento");
    console.log("Datos nuevo apartamento", req.body);
}