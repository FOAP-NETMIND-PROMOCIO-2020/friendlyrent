const Services = require('../models/apartments').Services

module.exports = class tools {

    /**
     * Creation of an apartment object with this function.
     * @param {Object} parameters This is an object that comes from the form
     * @param {String} idUser This is the User id
     */
    static constructorApartment = async(parameters,idUser,photos) => {

        let objectApartment = {

            title:parameters.title,
            description:parameters.description,
            terms:parameters.terms,
            rooms:parseInt(parameters.rooms),
            bathrooms:parseInt(parameters.bathrooms),
            squareMeters:parameters.squareMeters,
            location:{
                city:parameters.city,
                province:parameters.province,
                address:parameters.address,
                gps:[]
            },
            photos:[
                {
                    title:parameters.mainPhoto,
                    url:'/uploads/'+photos[0].filename
                },
                {
                    title:parameters.titlePhoto2,
                    url:'/uploads/'+photos[1].filename
                },
                {
                    title:parameters.titlePhoto3,
                    url:'/uploads/'+photos[2].filename
                },
                {
                    title:parameters.titlePhoto4,
                    url:'/uploads/'+photos[3].filename
                }
            ],
            services:[],
            price:parameters.price,
            durationMonths:parseInt(parameters.durationMonths),
            comments:[],
            unsubscribeUser:'',
            unsubscribeDate:'',
            registerUser:idUser,
            registerDate:new Date().toLocaleDateString(),//ojo 
            idBooking:''

        }

        let services = await Services.getAllServices();[{},{},{}]

        if(services){

            if(services.length > 0){

                for (let i = 0; i < parameters.services.length; i++) {

                    for (let a = 0; a < services.length; a++) {
                        
                        if(parameters.services[i] == services[a].codeService){

                            objectApartment.services.push(services[a]._id)
                            break;

                        }
                        
                    }

                }
            
            }

        }

        return objectApartment

    }
 
     
};