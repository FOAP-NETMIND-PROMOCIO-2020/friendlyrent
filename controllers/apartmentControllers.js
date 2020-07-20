exports.getAllApartments = (req, res) => {
    res.render('index', {
        role: 'inquilino'
    });
}

exports.getDetailedApartment = (req, res) => {
    let apartment = 
    {
        "_id": {
            "$oid": "5f1099b6cb88132eb682c5f4"
        },
        "title": "Apartment in Platja D'Aro",
        "description": "Bonito apartamento con jardin y piscina comunitaria. A 5 min. de la playa",
        "terms": "No se permiten mascotas",
        "rooms": 3,
        "bathrooms": 2,
        "squareMetres": 85,
        "location": {
            "city": "Platja D'Aro",
            "province": "Girona",
            "address": "Carrer Pujades, 21. Baixos",
            "gps": ["41.392791", "2.161983"]
        },
        "photos": [{
            "title": "Foto Principal",
            "url": "https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?cs=srgb&dl=white-2-storey-house-near-trees-1115804.jpg&fm=jpg"
        }, 
        {
            "title": "Interior",
            "url": "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?cs=srgb&dl=interior-design-of-a-house-1571460.jpg&fm=jpg"
        }, 
        {
            "title": "Habitacion doble",
            "url": "https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg?cs=srgb&dl=photo-of-bedroom-1454806.jpg&fm=jpg"
        }, 
        {
            "title": "Baño Principal",
            "url": "https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg?cs=srgb&dl=bathroom-interior-1457847.jpg&fm=jpg"
        }],
        
        "services": [
            {
            "_id":{
            "$oid":"5f0df1b75a7aafdd0c7b2654"
            },
            "codeService":"AC",
            "iconService":"fa fa-snowflake-o"
            },

            {
                "_id":{
                "$oid":"5f0df261b50f726b21f06ccd"
                },
                "codeService":"TV",
                "iconService":"fa fa-tv"
            }, 

            {
                "_id":{
                "$oid":"5f0df271b50f726b21f06cce"
                },
                "codeService":"WiFi",
                "iconService":"fa fa-wifi"
                }
        ],

        "price": 1200,
        "durationMonths": 24,
        "comments": [{
            "comment": "El apartamento esta bien situado",
            "user_id": {"userName":"Pepe Gonzalez"},
            "creationDate": "2020-07-14",
            "_id": {
                "$oid": "5f0df3f15a7aafdd0c7b2655"
            }
        }, 
        {
            "comment": "La piscina estaba adaptada a bebes",
            "user_id": {"userName":"Juan Rodriguez"},
            "creationDate": "2020-07-14",
            "_id": {
                "$oid": "5f0df40f5a7aafdd0c7b2656"
            }

        }]
        
    }

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
