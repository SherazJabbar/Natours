const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require("../models/tourModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const factory = require("./handlerFactory");


exports.getCheckoutSession = catchAsync(async (req, res, next) => {
    // 1) Get the currently booked tour
    const tour = await Tour.findById(req.params.tourID)

    // 2) Create the checkout session 
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        success_url: `${req.protocol}://${req.get('host')}/`,
        cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.tourID,
        line_items: [
            {

                price_data: {
                    currency: 'usd',
                    unit_amount: tour.price * 100,
                    product_data: {
                        name: `${tour.name}`,
                        description: tour.summary,
                        images: [`https://www.natours.dev/img/tours/${tour.imageCover}.jpg`],
                    },
                },
                quantity: 1,
            }
        ]
    })

    // 3) Send it to the client 
    res.status(200).json({
        status: 'success',
        session
    })
});