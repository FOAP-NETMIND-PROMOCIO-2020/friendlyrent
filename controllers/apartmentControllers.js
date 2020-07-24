const Apartment = require('../models/apartments').Apartment;

exports.getAllApartments = (req, res) => {
    res.render('index', {
        role: 'inquilino'
    });
}

exports.getDetailedApartment = async (req, res) => {
    const idApartment = req.params.idApartment;
    console.log("ID Apartamento recuperado", idApartment);
    const apartment = await Apartment.getOneApartment({_id: idApartment});
    console.log("Apartamento recuperado", apartment);

    res.render('properties-single', {
        apartment: apartment,
        isLoggedUser: (req.user && req.user.identifUser == "customer")
    });
}

exports.postSignUp = (req, res) => {
    let parameters = req.body;
    console.log("valor de parameters --> ", parameters)
    parameters = JSON.stringify(parameters);

    res.render('index', {
        role: 'inquilino'
    });
}

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

exports.postNewApartment = (req, res) => {
    res.send("Hemos recibido los datos del apartamento");
    console.log("Datos nuevo apartamento", req.body);
}
