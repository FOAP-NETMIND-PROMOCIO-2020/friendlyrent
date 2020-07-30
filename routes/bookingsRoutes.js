const express = require('express');
const auth = require('../middleware/auth.js').isLoggedIn;

const isLoggedIn = auth;

const router = express.Router();

const bookingsControllers = require('../controllers/bookingsControllers');

router.get('/new-booking/:idApartment', isLoggedIn, bookingsControllers.getNewRental); 
router.post('/new-booking', isLoggedIn, bookingsControllers.postNewRental);

module.exports = router;