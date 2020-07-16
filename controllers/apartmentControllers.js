exports.getAllApartments = (req, res) => {
    res.render('index');
}

exports.getNewApartment = (req, res) => {
    res.render('new-apartment');
}

exports.postNewApartment = (req, res) => {
    res.send("Hemos recibido los datos del apartamento");
    console.log("Datos nuevo apartamento", req.body);
}