// Express modules
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const apartmentRoutes = require('./routes/apartmentRoutes');

app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static('public'));

app.set('view engine', 'ejs');

app.use(apartmentRoutes);

app.listen(3000);