exports.getAllApartments = (req, res) => {
    res.render('index');
}

exports.postSignUp = (req, res) => {
    let parameters = req.body;
    console.log("valor de parameters --> ", parameters)
    parameters = JSON.stringify(parameters);
    res.send("you are signed up.\n These are the parametrs: \n" + parameters);
}