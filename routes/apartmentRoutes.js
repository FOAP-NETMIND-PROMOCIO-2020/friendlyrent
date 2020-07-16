const express = require('express');

const router = express.Router();

const apartmentControllers = require('../controllers/apartmentControllers');

router.get('/', apartmentControllers.getAllApartments);
router.get('/new-apartment', apartmentControllers.getNewApartment);

router.post('/new-apartment', apartmentControllers.postNewApartment);

router.post("/post-register-new-user", apartmentControllers.postSignUp);


module.exports = router;