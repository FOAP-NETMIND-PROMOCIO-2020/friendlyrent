const Services = require('../models/apartments').Services
const Tools = require('../models/tools');
const bookings = require('../models/bookings');
const Apartment = require('../models/apartments').Apartment

exports.getAllApartments = async (req, res) => {
    const maxPrice = req.query.maxPrice;
    const city = req.query.city;
    const bathrooms = req.query.bathrooms;
    const rooms = req.query.rooms;
    let searchCriteria = {};

    if (maxPrice) {
        searchCriteria["price"] = { $lte: maxPrice };
    }

    if (city) {
        searchCriteria["location.city"] = { $eq: city }
    }

    if (bathrooms) {
        searchCriteria["bathrooms"] = { $gte: bathrooms }
    }

    if (rooms) {
        searchCriteria["rooms"] = { $gte: rooms }
    }
    
    const apartments = await Apartment.getAllAvailableApartmentsForBooking(searchCriteria);
    console.log("Search criteria", searchCriteria);

    //  tenemos que mirar lo de sacar solo los apartamentos que esten Disponibles.
    // hay que buscar por idApartment los que tengan en la colection booking el requestStatus diferente de accepted
    //var filter = [];
    //const apartmentsAccepted = await bookings.find(apartments._id);
    console.log('Que es esto: ', apartments)

    res.render('index', {
        isCustomer: (req.user && req.user.identifUser == "customer"),
        apartments: apartments,
    });
}

exports.getDetailedApartment = async (req, res) => {

    let apartment = await Apartment.getOneApartment({ _id: req.params.idApartment })

    res.render('properties-single', {
        apartment: apartment
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

exports.getNewApartment = async (req, res) => {

    if (req.user) {
        if (req.user.identifUser != 'owner') {
            res.send("you have to be logged in as owner before inserting");
        }
    } else {
        res.send("you have to be logged in before inserting");
    }

    let services = await Services.getAllServices();

    res.render('new-apartment', {
        services: services
    });

}

exports.postNewApartment = async (req, res) => {

    if (!(req.user)) {
        res.send("you have to be logged in before inserting");
    }

    let apartment = await Tools.constructorApartment(req.body, req.user._id)

    let apartmentInserted = await Apartment.createNewApartment(apartment)

    if (apartmentInserted._id) {
        res.redirect('/apartment/' + apartmentInserted._id)
    } else {
        res.send('Your apartment has not been saved');
    }

}