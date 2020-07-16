// Express modules
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const apartmentRoutes = require('./routes/apartmentRoutes')

//server variables
app.set('view engine', 'ejs');

//midleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('public'));
app.use(apartmentRoutes);


app.listen(3000);