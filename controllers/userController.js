const { query } = require("express");
const User = require("../models/userModal");
const catchAsync = require("../utils/catchAsync");


exports.getAllUsers = catchAsync(async (req, res, next) => {

    const users = await User.find();
    return res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users: users
        }
    })
});
exports.createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: "Route not implemented"
    })
}
exports.getUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: "Route not implemented"
    })
}
exports.updateUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: "Route not implemented"
    })
}
exports.deleteUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: "Route not implemented"
    })
}
