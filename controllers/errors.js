exports.get404 = (req, res) => {
    res.status(404).render('404');
}

// Para tener en cuenta el error de tipo 500 que se encuentra en el archivo 500.ejs
exports.get500 = (req, res) => {
    res.status(500).render('500');
}