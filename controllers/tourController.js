const { query } = require("express");
const Tour = require("../models/tourModel");
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const factory = require("./handlerFactory");

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));



exports.aliasAllTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name, price.ratingsAverage, summary, difficulty';
    next();
};

// 1) Route Handlers


exports.getAllTours = factory.getAll(Tour);
// exports.getAllTours = catchAsync(async (req, res, next) => {
//     // Execute Query
//     const features = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().paginate();
//     const tours = await features.query;
//     return res.status(200).json({
//         status: 'success',
//         results: tours.length,
//         data: {
//             tours: tours
//         }
//     })
// });

exports.getTour = factory.getOne(Tour, { path: 'reviews' });

// exports.getTour = catchAsync(async (req, res, next) => {
//     const tour = await Tour.findById(req.params.id).populate('reviews');

//     if (!tour) {
//         return next(new AppError('No tour found with that ID', 404))
//     }

//     res.status(200).json({
//         status: 'success',
//         data: {
//             tour
//         }
//     })
// });

exports.createTour = factory.createOne(Tour);

// exports.createTour = catchAsync(async (req, res, next) => {
//     //  create new tour document
//     const newTour = await Tour.create(req.body);
//     res.status(201).json({
//         status: "success",
//         data: {
//             tour: newTour
//         }
//     })
// });

exports.updateTour = factory.updateOne(Tour);

// exports.updateTour = catchAsync(async (req, res, next) => {
//     const updateTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//         new: true,
//         runValidators: true
//     })
//     if (!updateTour) {
//         return next(new AppError('No tour found with that ID', 404))
//     }
//     res.status(200).json({
//         status: "success",
//         data: {
//             tour: updateTour
//         }
//     })
// });

exports.deleteTour = factory.deleteOne(Tour);

// exports.deleteTour = catchAsync(async (req, res, next) => {
//     const deletedTour = await Tour.findByIdAndDelete(req.params.id)
//     if (!deletedTour) {
//         return next(new AppError('No tour found with that ID', 404))
//     }
//     res.status(204).json({
//         status: "success",
//         data: null
//     })
// });

// ---------------------- Aggregation Queries ------------------------------

exports.getTourStats = catchAsync(async (req, res, next) => {

    // Aggregation PipeLine
    const stats = await Tour.aggregate([
        {
            $match: { ratingsAverage: { $gte: 4.5 } }
        },
        {
            $group: {
                _id: { $toUpper: "$difficulty" },
                numTours: { $sum: 1 },
                numRatings: { $sum: '$ratingsQuantity' },
                avgRating: { $avg: '$ratingsAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' }
            }
        },
        {
            $sort: {
                avgPrice: 1
            }
        },
        // can use aggregation stages multiple time
        // {
        //     $match: {
        //         _id: {
        //             $ne: 'EASY'
        //         }
        //     }
        // }
    ])

    res.status(200).json({
        status: "success",
        data: {
            stats
        }
    })

});


exports.getMonthlyPlan = catchAsync(async (req, res, next) => {

    const year = req.params.year * 1;

    const plan = await Tour.aggregate([
        {
            // $unwind return documents based on the provide attribute
            $unwind: '$startDates'
        },
        {
            // $match selects a document on given condition
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`),
                }
            }
        },
        {
            $group: {
                _id: { $month: '$startDates' },
                numTourStarts: { $sum: 1 },
                tours: { $push: '$name' }
            }
        },
        {
            $addFields: { month: '$_id' }
        },
        {
            $project: { _id: 0 }
        },
        {
            // 1 for ascending & -1 for descending
            $sort: { numTourStarts: 1 }
        },
        // {
        //     $limit: 3
        // }

    ]);

    res.status(200).json({
        status: "success",
        data: {
            plan
        }
    })
});