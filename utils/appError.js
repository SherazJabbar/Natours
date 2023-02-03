class AppError extends Error {
    constructor(message, statusCode) {
        // Super is used to called parent class constructor
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}


module.exports = AppError;