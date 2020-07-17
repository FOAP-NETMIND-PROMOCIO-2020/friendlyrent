// Express modules
const express = require('express');
const app = express();

const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyparser = require('body-parser');
const session = require('express-session');
const apartmentRoutes = require('./routes/apartmentRoutes')

const { url } = require('./config/database');

// Connection to DDBB
mongoose.connect(url, {
    //useMongoClient: true    //OJO, esto es deprecated y Mongo sugiere poner las dos instrucciones siguientes:
    useNewUrlParser: true,
    useUnifiedTopology: true    
})
require('./config/passport')(passport);


//server variables
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views')); //da la dirección de la carpeta views
app.set('view engine', 'ejs');

//midleware
app.use(morgan('dev'));
app.use(cookieParser());  //administra cookies
app.use(bodyparser.urlencoded({extended: false}));  //info interpretable a través de la url
app.use(session({
    secret: 'loquesea',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(express.static('public'));
app.use(apartmentRoutes);

// routes
require('./routes/userRoutes')(app, passport);

// static files
app.use(express.static(path.join(__dirname, 'public')));

app.listen(app.get('port')), () => {
    console.log("server on port", app.get('port'));
}