const Services = require('../models/apartments').Services
const Tools = require('../models/tools')
const Apartment = require('../models/apartments').Apartment
const User = require('../models/user')

exports.getAllApartments = (req, res) => {
    res.render('index', {
        role: 'inquilino'
    });
}

exports.getDetailedApartment = async (req, res) => {
    
    let apartment = await Apartment.getOneApartment({_id:req.params.idApartment})

    res.render('properties-single', {
        apartment:apartment 
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

exports.getNewApartment = async(req, res) => {

    if (req.user) {
        if (req.user.identifUser != 'owner' ){
            res.send("you have to be logged in as owner before inserting");
        }
    } else{
        res.send("you have to be logged in before inserting");
    }

    let services = await Services.getAllServices();
       
    res.render('new-apartment', {
        services: services
    });

}

exports.postNewApartment = async(req, res) => {

    if (!(req.user)) {
        res.send("you have to be logged in before inserting");
    }

    let apartment = await Tools.constructorApartment(req.body,req.user._id)
    
    let apartmentInserted = await Apartment.createNewApartment(apartment)
    
    if(apartmentInserted._id){
        res.redirect('/apartment/'+apartmentInserted._id)
    }else{
        res.send('Your apartment has not been saved'); 
    }

}


exports.postAJAXuser = async(req,res) => {

    let x = await User.find({},{'local.email':1}).catch(err => console.log('error: -> ', err))    
    console.log('------------------------------------',x);
    res.send(x)
    
}