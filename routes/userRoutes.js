const passport = require("passport");
const Bookings = require('../models/bookings')
const User = require('../models/user')
const Apartments = require('../models/apartments').Apartment

module.exports = (app, passport) => {

    app.get('/', (req, res)  => {
        res.render('index');
    });

    app.get('/login', (req, res)  => {
        if(req.isAuthenticated()) {
            return res.redirect('/');
        }
        res.render('login', {
            message: req.flash('loginMessage'),  //mensaje desde la misma vista
            user: req.user
        });
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    }));

    app.get('/signup', (req, res) => {
        res.render('signup', {
            message: req.flash('signupMessage'),
            user: req.user
        });
    })

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/',
        failureRedirect: '/',
        failureFlash: true
    }));

    app.get('/profile', isLoggedIn, async (req, res) => {  // impide acceder a los no logueados

        const owner = req.user._id;
        const apartment = "";

        console.log("-----AQYUIIIIIIIIIIIIIIIIIIIIIIIIIIIII")

        if(req.user && req.user.identifUser == "owner"){
            let searchCriteria = {};

            if (owner) {
                searchCriteria["registerUser"] = { $eq: owner };
            }
        
            if (apartment) {
                searchCriteria["_id"] = { $eq: apartment }
            }

            console.log("--------Que parametros mando", searchCriteria)
            var apartmentOwner = await Apartments.getAllApartmentsOwn(searchCriteria);
             // console.log("--------Que hay de mis apartamentos", apartmentOwner)
        }
        
        res.render('profile', {
            user: req.user,     // aquí está la info del usuario
            isOwner: (req.user && req.user.identifUser == "owner"),
            isCustomer: (req.user && req.user.identifUser == "customer"),
            apartmentCustomer: [{
                
                title: "Platja D'Aro",
                startDate: "2018-01-01",
                endDate: "2020-01-01"
            },
            {
                title: "Calafat",
                startDate: "2020-03-01",
                endDate: "2020-07-01"
            }
            ],
            apartmentOwner: apartmentOwner 
                
            
                
            
        });
    });

    app.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/login');
    }

    app.post('/add-comment', (req, res) => {
        
        res.render('add-comment', {
            idUser: req.body.id_user,
            idOwner: req.body.id_owner

        })

    })

    app.post('/new-comment', async (req, res) => {
        
        await User.writetMessages(req.body.id_owner, req.body.id_user, req.body.comment);
        res.redirect('/profile')
       
    });

    app.post('/rejected', async (req, res) => {
        
        await Bookings.setRequestStatusToRejected(req.body.id_apartment, req.body.id_booking);
        res.redirect('/profile')
       
    });

    app.post('/accepted', async (req, res) => {
        
        await Bookings.setRequestStatusToAccept(req.body.id_booking);
        res.redirect('/profile')
       
    });
}
