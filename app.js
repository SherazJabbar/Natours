const express = require('express');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const helmet = require('helmet');
const hpp = require('hpp');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers//errorController');
// const tourRouter = require('./routes//tourRoutes');
// const userRouter = require('./routes/userRoutes');
// const reviewRouter = require("./routes/reviewRoutes");
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');
const authController = require('./controllers/authController');

const app = express();

app.set('view engine', 'pug');
app.set("views", path.join(__dirname, 'views'));

authController.configurePassport();

// 1) Global  MiddleWares

// Set security https headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request',
});

app.use('/api', limiter);

// Body pasrser, reading data from body into req.body
app.use(
  express.json({
    limit: '10kb',
  })
);

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp({
  // whitelist is actually the array of params that we allow to duplication
  whitelist: [
    'duration',
    'ratingsQuantity',
    'ratingsAverage',
    'maxGroupSize',
    'difficulty',
    'price'
  ]
}));

// Serving static files
app.use(express.static(`${__dirname}/public`));

// Defining middleware
// The middleware applies to each & every req
// app.use((req,res, next) => {
//     console.log("Hello from the middleware");
//     next();
// });

// The middleware applies to each & every req
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.headers);
  next();
});

// mounting routers --- router middlewares
// app.use(`/api/v1/tours`, tourRouter);
// app.use(`/api/v1/users`, userRouter);
// app.use(`/api/v1/reviews`, reviewRouter);
//for documentation 
require('./index.js')(app);

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

// Error handling middleware
app.use(globalErrorHandler);

module.exports = app;
