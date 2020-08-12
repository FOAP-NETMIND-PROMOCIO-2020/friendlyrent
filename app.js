// Express modules
const express = require('express');
const app = express();

const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const bodyparser = require('body-parser');
const session = require('express-session');
const apartmentRoutes = require('./routes/apartmentRoutes');
const bookingsRoutes = require('./routes/bookingsRoutes');

const errorControllers = require('./controllers/errors');
const team = require('./controllers/teamControllers');

const { url } = require('./config/database');
const { clear } = require('console');

// Connection to DDBB
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 5000,    
})
.then((res) => {
    app.listen(process.env.PORT || 3000); // sustituye al listen(3000)
    console.log("Conexión con la BBDD");
  })
  .catch((err) => {
    console.log("Error al conectar a la base de datos:", err);
  });

require('./config/passport')(passport);

// server variables
app.set('views', path.join(__dirname, 'views')); //da la dirección de la carpeta views
app.set('view engine', 'ejs');

// middleware
app.use(cookieParser());  //administra cookies
app.use(bodyparser.urlencoded({extended: false}));  //info interpretable a través de la url
app.use(session({
    secret: 'session secret key',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(express.static('public'));
app.use(apartmentRoutes);
app.use(bookingsRoutes);

app.get('/team', team.getTeam);


// routes
require('./routes/userRoutes')(app, passport);

// static files
app.use(express.static(path.join(__dirname, 'public')));

//Errores 404 y 500
app.use('/500', errorControllers.get500);
app.use(errorControllers.get404); 

// Gestión de errores para la inserción de una reserva (Bookings)
app.use((err, req, res, next) => {
    console.error("Ha ocurrido un error", err);
    res.redirect('/500'); //Donde lo redireccionamos?? Al detalle del apartamento a una pàgina 500?
})

app.listen(app.get('port')), () => {
    console.log("server on port", app.get('port'));
}