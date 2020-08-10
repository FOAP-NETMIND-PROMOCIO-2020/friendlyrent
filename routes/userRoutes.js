const passport = require("passport");
const Bookings = require('../models/bookings')
const User = require('../models/user')


module.exports = (app, passport) => {

    // app.get('/', (req, res)  => {
    //     res.render('index');
    // });

    app.get('/login', (req, res)  => {
        if(req.isAuthenticated()) {
            return res.redirect('/');
        }
        res.render('login', {
            message: req.flash('loginMessage'),  //mensaje desde la misma vista
            user: req.user,
            path: "LoginPage"
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
            user: req.user,
            path: "SignUpPage"
        });
    })

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/',
        failureRedirect: '/',
        failureFlash: true
    }));

    app.get('/profile', isLoggedIn, async (req, res) => {  // impide acceder a los no logueados
        
        if(req.user && req.user.identifUser == "owner"){
            
            var apartmentOwner = await Bookings.getAllApartmentsOwn(req.user._id);
             
        }
        
        res.render('profile', {
            user: req.user,     // aquí está la info del usuario
            isOwner: (req.user && req.user.identifUser == "owner"),
            path: "ProfilePage",
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
        
        await User.writedMessages(req.body.id_owner, req.body.id_user, req.body.comment);
        res.redirect('/profile')
       
    });
}
