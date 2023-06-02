const AppError = require('./utils/appError');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require("./routes/reviewRoutes");
const viewRouter = require("./routes/viewRoutes");
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');



const routes = (app) => {
    app.use('/', viewRouter);
    app.use('/api/v1/tours', tourRouter);
    app.use('/api/v1/users', userRouter);
    app.use('/api/v1/reviews', reviewRouter);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
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

        next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
    });
}

module.exports = routes