const AppError = require("../utils/appError");

const handleJWTError = () => new AppError("Invalid Token. Please Login Again", 401);

const handleJWTExpiredError = () => new AppError('Your Token has expired. Please login again!', 401);

const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
}

const handleDuplicateFieldsDB = (err) => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate field value: ${value}. Please use another value!`
    return new AppError(message, 400)
}

const handleValidationErrorDB = (err) => {
    // const errors = Object.values(err.errors).map((el) => {
    //     el.ValidationError;
    // });
    const errors = Object.values(err.errors);


    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
}

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    })
};

const setErrorProduction = (err, res) => {
    // Operational, trusted error: send message to the client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        })
        // Programming or other unknown error: don't leak error details
    } else {
        res.status(500).json({
            status: 'error',
            message: "Something went very wrong!"
        })
    }
}



module.exports = (err, req, res, next) => {

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === "development") {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === "production") {
        let error = Object.assign(err)
        console.log("error", error)
        if (error.name === 'CastError') {
            error = handleCastErrorDB(error);
        }
        if (error.code === 11000) {
            error = handleDuplicateFieldsDB(error);
        }
        if (error.name === 'ValidationError') {
            error = handleValidationErrorDB(error)
        }
        if (error.name === 'JsonWebTokenError') {
            error = handleJWTError()
        }
        if (error.name === 'TokenExpiredError') {
            error = handleJWTExpiredError()
        }
        setErrorProduction(error, res);
    }

}