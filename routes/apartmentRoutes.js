const express = require('express');
const isLoggedIn = require('../middleware/auth.js').isLoggedIn;

const router = express.Router();

const apartmentControllers = require('../controllers/apartmentControllers');

router.get('/', apartmentControllers.getAllApartments);
router.get('/new-apartment',isLoggedIn, apartmentControllers.getNewApartment);

router.post('/new-apartment',isLoggedIn, apartmentControllers.postNewApartment);

router.post("/post-register-new-user", apartmentControllers.postSignUp);


router.get('/apartment/:idApartment', apartmentControllers.getDetailedApartment); 

router.post('/AJAX', apartmentControllers.postAJAXuser); 

module.exports = router;