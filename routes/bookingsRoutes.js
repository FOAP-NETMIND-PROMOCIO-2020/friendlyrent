const express = require('express');

const router = express.Router();

const apartmentControllers = require('../controllers/apartmentControllers');

router.get('/new-booking/:idApartment', bookingControllers.getNewRental); 
router.post('/new-booking', bookingControllers.postNewRental);

module.exports = router;