const express = require('express');
const morgan = require("morgan");
const tourRouter = require('./routes//tourRoutes');
const userRouter = require('./routes/userRoutes');


const app = express();

// 1) MiddleWares
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

app.use(express.static(`${__dirname}/public`))

// middleware
app.use(express.json());
// Defining middleware
// The middleware applies to each & every req
app.use((req,res, next) => {
    console.log("Hello from the middleware");
    next();
});

// The middleware applies to each & every req
app.use((req,res, next)=> {
    req.requestTime = new Date().toISOString();
    next();
})


// mounting routers --- router middlewares
app.use(`/api/v1/tours`,tourRouter);
app.use(`/api/v1/users`, userRouter);


module.exports = app;