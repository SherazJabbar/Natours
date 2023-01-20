const express = require('express')
const tourController = require('../controllers/tourController');
const router = express.Router();


router.route('/top-5-cheap').get(tourController.aliasAllTours, tourController.getAllTours)

// chaining middlewares
router.route(`/`).get(tourController.getAllTours).post(tourController.createTour);
router.route(`/:id`).get(tourController.getTour).patch(tourController.updateTour).delete(tourController.deleteTour);


module.exports = router;