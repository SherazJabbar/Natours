const express = require('express');
const app = express();
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require("./routes/reviewRoutes");



const routes = (app) => {
    app.get('/', (req, res) => {
        res.status(200).render('base')
    })
    app.use(`/api/v1/tours`, tourRouter);
    app.use(`/api/v1/users`, userRouter);
    app.use(`/api/v1/reviews`, reviewRouter);
}

module.exports = routes