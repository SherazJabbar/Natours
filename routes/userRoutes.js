const express = require('express');
const passport = require('passport');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');


const router = express.Router();

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Route for handling the Google OAuth callback
router.get(
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        // Redirect or send a response after successful authentication
        res.send("Logged In")
    }
);
router.post(`/signup`, authController.signup);
router.post(`/login`, authController.login);
router.get('/logout', authController.logout);
router.post(`/forgotPassword`, authController.forgotPassword);
router.patch(`/resetPassword/:token`, authController.resetPassword);

// Only call the next middle once authController.protect is executed
// Protect all routes after this middleware
router.use(authController.protect);

router.patch(`/updateMyPassword`, authController.updatePassword);
router.get("/me", userController.getMe, userController.getUser);
router.patch(`/updateMe`, userController.uploadUserPhoto, userController.resizeUserPhoto, userController.updateMe);
router.delete(`/deleteMe`, userController.deleteMe);

// Protect all routes protected & restricted to admin only
router.use(authController.restrictTo('admin'));

router.route(`/`).get(userController.getAllUsers);
router.route(`/:id`).get(userController.getUser).patch(userController.updateUser).delete(userController.deleteUser);




module.exports = router;