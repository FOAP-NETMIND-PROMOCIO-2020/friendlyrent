const express = require('express');

const router = express.Router();

const bookingsControllers = require('../controllers/bookingsControllers');

router.get('/new-booking', bookingsControllers.getNewRental); 
router.post('/new-booking', bookingsControllers.postNewRental);

module.exports = router;