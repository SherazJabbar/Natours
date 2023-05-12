const express = require('express')
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewRouter = require('../routes/reviewRoutes');
const router = express.Router();



router.use('/:tourId/reviews', reviewRouter);

// chaining middlewares
router.route('/top-5-cheap').get(tourController.aliasAllTours, tourController.getAllTours)
router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);
router.route(`/`).get(authController.protect, tourController.getAllTours).post(tourController.createTour);
router.route(`/:id`).get(tourController.getTour).patch(tourController.updateTour).delete(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.deleteTour);
// router.route('/:tourId/reviews').post(authController.protect, authController.restrictTo('user'), reviewController.createReview);

module.exports = router;   