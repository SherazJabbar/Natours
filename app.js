const express = require('express');
const morgan = require("morgan");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers//errorController");
const tourRouter = require('./routes//tourRoutes');
const userRouter = require('./routes/userRoutes');


const app = express();

// 1) MiddleWares
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(express.static(`${__dirname}/public`))

// middleware
app.use(express.json());
// Defining middleware
// The middleware applies to each & every req
// app.use((req,res, next) => {
//     console.log("Hello from the middleware");
//     next();
// });

// The middleware applies to each & every req
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
})


// mounting routers --- router middlewares
app.use(`/api/v1/tours`, tourRouter);
app.use(`/api/v1/users`, userRouter);

app.all('*', (req, res, next) => {
    // 1) Initial way to implement error handling
    // res.status(404).json({ 
    //     status: 'failed',
    //     message: `Cam't find ${req.originalUrl}`
    // })
    // next(); 

    // 2) Second way to implement error handling
    // const err = new Error(`Cam't find ${req.originalUrl}`);
    // err.status = 'fail';
    // err.statusCode = 404;
    // next(err);

    // Error Implementation using AppErrorClass

    next(new AppError(`Cam't find ${req.originalUrl} on this server!`, 404));
});

// Error handling middleware
app.use(globalErrorHandler);


module.exports = app;