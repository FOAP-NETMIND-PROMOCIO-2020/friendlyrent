const passport = require("passport");
const Bookings = require('../models/bookings');
const User = require('../models/user');
const Apartments = require('../models/apartments').Apartment;
const async = require('async');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const sendgridTransport = require("nodemailer-sendgrid-transport");

module.exports = (app, passport) => {

    app.get('/login', (req, res) => {
        if (req.isAuthenticated()) {
            return res.redirect('/');
        }
        let message = req.flash('loginMessage');
        let status;

        if (message.length != 0) {
            console.log("A ver...", message)
            if (message[0].includes('Wrong') || message[0].includes('No user found.')) {
                status = "danger";
            } else {
                status = "success";
            }
        }
        res.render('login', {
            message: message, //mensaje desde la misma vista
            alert: status,
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
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/',
        failureRedirect: '/',
        failureFlash: true
    }));

    app.get('/forgot', (req, res) => {
        res.render('forgot', {
            user: null,
            message: req.flash('error'),
            path: ""
        });

    });

    app.post('/forgot', (req, res, next) => {
        async.waterfall([
            function(done) {
                crypto.randomBytes(20, function(err, buf) {
                    var token = buf.toString('hex');
                    done(err, token);
                });
            },
            function(token, done) {
                User.findOne({ email: req.body.email }, function(err, user) {
                    if (!user) {
                        req.flash('error', 'No account with that email address exists.');
                        return res.redirect('/forgot');
                    }

                    user.resetPasswordToken = token;
                    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                    user.save(function(err) {
                        done(err, token, user);
                    });
                });
            },
            function(token, user, done) {

                var smtpTransport = nodemailer.createTransport(
                    sendgridTransport({
                        auth: {
                            api_key: process.env.API_SENDGRID
                        }
                    }));
                console.log("Token", 'http://' + req.headers.host + '/reset/' + token)
                console.log("Email: ", user.email)
                var mailOptions = {
                    to: user.email,
                    from: 'oscar.miras@tutor.bit.es',
                    subject: 'Password Reset',
                    text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                        'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                };
                smtpTransport.sendMail(mailOptions, function(err) {
                    req.flash('loginMessage', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
                    done(err, 'done');
                });
            }
        ], function(err) {
            res.render('login', {
                message: req.flash('loginMessage'), //mensaje desde la misma vista
                alert: 'primary',
                user: req.user,
                path: 'LoginPage'
            });
        });
    });

    app.get('/reset/:token', function(req, res) {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
            if (!user) {
                req.flash('error', 'Password reset token is invalid or has expired.');
                return res.redirect('/forgot');
            }
            res.render('reset', {
                user: req.user,
                token: req.params.token,
                message: req.flash('error'),
                path: ''
            });
        });
    });

    app.post('/reset/:token', function(req, res) {
        async.waterfall([
            function(done) {

                if (req.body.password != req.body.confirm) {
                    req.flash('error', 'Passwords are different!');
                    return res.redirect('back');
                }
                User.findOne({ resetPasswordToken: req.params.token.slice(1), resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {

                    if (!user) {
                        req.flash('error', 'Password reset token is invalid or has expired.');
                        return res.redirect('back');
                    }

                    user.local.password = user.generateHash(req.body.password);
                    user.resetPasswordToken = undefined;
                    user.resetPasswordExpires = undefined;
                    user.save(function(err) {
                        req.logIn(user, function(err) {
                            done(err, user);
                        });
                    });
                });
            },
            function(user, done) {
                var smtpTransport = nodemailer.createTransport(
                    sendgridTransport({
                        auth: {
                            api_key: process.env.API_SENDGRID
                        }
                    }));

                var mailOptions = {
                    to: user.email,
                    from: 'oscar.miras@tutor.bit.es',
                    subject: 'Your password has been changed',
                    text: 'Hello,\n\n' +
                        'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
                };
                smtpTransport.sendMail(mailOptions, function(err) {
                    req.flash('success', 'Success! Your password has been changed.');
                    done(err);
                });
            }
        ], function(err) {
            res.render('login', {
                message: req.flash('success'), //mensaje desde la misma vista
                alert: 'success',
                user: req.user,
                path: 'LoginPage'
            });
        });
    });

    app.get('/profile', isLoggedIn, async(req, res) => { // impide acceder a los no logueados

        const owner = req.user._id;
        const apartment = "";

        if (req.user && req.user.identifUser == "owner") {
            let searchCriteria = {};

            if (owner) {
                searchCriteria["registerUser"] = { $eq: owner };
            }

            if (apartment) {
                searchCriteria["_id"] = { $eq: apartment }
            }

            var apartmentOwner = await Apartments.getAllApartmentsOwn(searchCriteria);
        }

        res.render('profile', {
            user: req.user, // aquí está la info del usuario
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

    app.post('/new-comment', async(req, res) => {

        await User.writedMessages(req.body.id_owner, req.body.id_user, req.body.comment);
        res.redirect('/profile')

    });

    app.post('/rejected', async(req, res) => {

        await Bookings.setRequestStatusToRejected(req.body.id_apartment, req.body.id_booking);
        res.redirect('/profile')

    });

    app.post('/accepted', async(req, res) => {

        await Bookings.setRequestStatusToAccept(req.body.id_booking);
        res.redirect('/profile')

    });
}