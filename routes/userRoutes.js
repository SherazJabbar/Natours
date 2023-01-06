const express = require('express');
const userController = require('../controllers/userController');
const router= express.Router();


console.log(userController)
router.route(`/`).get(userController.getAllUsers);
router.route(`/:id`).get(userController.getUser).patch(userController.updateUser).delete(userController. deleteUser);

module.exports = router;