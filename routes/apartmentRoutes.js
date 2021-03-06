const express = require('express');
const multer  = require('multer')
const isLoggedIn = require('../middleware/auth.js').isLoggedIn;
const cpUpload = require('../middleware/multerUp').cpUpload;

const router = express.Router();

const apartmentControllers = require('../controllers/apartmentControllers');

router.get('/', apartmentControllers.getAllApartments);
router.get('/new-apartment',isLoggedIn, apartmentControllers.getNewApartment);
router.post('/new-apartment',isLoggedIn,cpUpload,apartmentControllers.postNewApartment);
router.get('/reset', apartmentControllers.resetApartmentQuery);
router.post('/new-apartment',isLoggedIn, apartmentControllers.postNewApartment);


router.post("/post-register-new-user", apartmentControllers.postSignUp);

router.get('/apartment/:idApartment', apartmentControllers.getDetailedApartment);
router.post('/apartment/:idApartment', apartmentControllers.postCommentApartment);

router.post('/AJAX', apartmentControllers.postAJAXuser); 

module.exports = router;