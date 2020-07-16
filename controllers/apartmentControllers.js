exports.getAllApartments = (req, res) => {
    res.render('index', {
        role: 'inquilino'
    });
}