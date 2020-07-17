const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

module.exports = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser ((id, done) =>{
        User.findById(id, (err, user) => {
            done(err, user);
        });
    }); 

    // signup
    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',  //username
        passwordField: 'password',
        passReqToCallback: true
     },
    function (req, email, password, done) {
        User.findOne({'local.email': email}, function(err, user) {
            if (err) { return done(err);}
            if (user) {
                return done(null, false, req.flash('signupMessage', 'The email already taken.'));
            } else {
                var newUser = new User();
                newUser.local.email = email;
                newUser.local.password = newUser.generateHash(password);
                newUser.role = "";
                newUser.email = email;
                console.log("nuevo usuario", newUser)
                newUser.save((err) => {
                    if (err) {throw err;}
                    return done(null, newUser);
                });
            }
        });
    }
     ));

     // login
    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',  //username
        passwordField: 'password',
        passReqToCallback: true
     },
    function (req, email, password, done) {
        User.findOne({'local.email': email}, function(err, user) {
            console.log("Usuario encontrado:", user, email)

            if (err) { return done(err);}
            if (!user) {
                return done(null, false, req.flash('loginMessage', 'No user found.'));
            } 
            if (!user.validatePassword(password)) {
                return done(null, false, req.flash('loginMessage', 'Wrong password'));
            }
            return done(null, user);
        })
    }
     ));
}