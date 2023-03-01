const User = require('../models/userModal');
const catchAsync = require("../utils/catchAsync");
const jwt = require('jsonwebtoken');
const AppError = require('./../utils/appError');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });

    const token = signToken(newUser._id)

    res.status(201).json({
        status: "success",
        token,
        data: {
            user: newUser
        }
    })
});


exports.login = catchAsync(async (req, res, next) => {
    const { email } = req.body;
    const { password } = req.body;

    // 1) Check if email & password exist
    if (!email || !password) {
        // As soon exception is caught exit from the controller
        return next(new AppError('Please provide email and password', 400));
    }

    // 2) Check if user exists & password is correct
    const user = await User.findOne({ email }).select('+password');


    if (!user || !await user.correctPassword(password, user.password)) {
        return next(new AppError('Incorrect email or password', 401))
    }

    // 3) If everything ok , send token to client
    const token = signToken(user._id);
    res.status(200).json({
        status: 'success',
        token
    })
});