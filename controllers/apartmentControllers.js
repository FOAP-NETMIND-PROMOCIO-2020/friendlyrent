exports.getAllApartments = (req, res) => {
    res.render('index', {
        role: 'inquilino'
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