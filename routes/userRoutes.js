const passport = require("passport");

module.exports = (app, passport) => {

    app.get('/', (req, res)  => {
        res.render('index');
    });

    app.get('/login', (req, res)  => {
        if(req.isAuthenticated()) {
            return res.redirect('/');
        }
        res.render('login', {
            message: req.flash('loginMessage')  //mensaje desde la misma vista
        });
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    }));

    app.get('/signup', (req, res) => {
        res.render('signup', {
            message: req.flash('signupMessage')
        });
    })

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/',
        failureRedirect: '/',
        failureFlash: true
    }));

    app.get('/profile', isLoggedIn, (req, res) => {  // impide acceder a los no logueados
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
            apartmentOwner: [
                {
                    title: "Palafurgell",
                    customerData: [
                        {
                            userName: "Manolo",
                            startDate: "2020-01-01",
                            endDate: "2020-03-01"
                        },
                        {
                            userName: "LauraDrums",
                            startDate: "2020-03-02",
                            endDate: "2020-05-05"
                        }
                    ]
                },
                {
                    title: "Begur",
                    customerData: [
                        {
                            userName: "Anna",
                            startDate: "2020-01-01",
                            endDate: "2020-03-01"
                        },
                        {
                            userName: "Raul",
                            startDate: "2020-03-02",
                            endDate: "2020-05-05"
                        },
                        {
                            userName: "Sergi",
                            startDate: "2020-05-31",
                            endDate: "2020-07-15"
                        }
                    ]
                }
                
            ]
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
}
