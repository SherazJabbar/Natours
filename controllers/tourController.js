const { query } = require("express");
const Tour = require("../models/tourModel");
const APIFeatures = require('../utils/apiFeatures');

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

exports.aliasAllTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name, price.ratingsAverage, summary, difficulty';
    next();
}


// 1) Route Handlers
exports.getAllTours = async (req, res) => {
    try {
        // Execute Query
        const features = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().paginate();
        const tours = await features.query;
        return res.status(200).json({
            status: 'success',
            results: tours.length,
            data: {
                tours: tours
            }
        })
    } catch (err) {
        console.log(err)
        return res.status(404).json({
            status: "Failed",
            message: err
        })
    }

}

exports.getTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        })
    } catch (err) {
        res.send(404).json({
            status: "Failed",
            message: err
        })
    }

}

exports.createTour = async (req, res) => {
    try {
        //  create new tour document
        const newTour = await Tour.create(req.body);
        res.status(201).json({
            status: "success",
            data: {
                tour: newTour
            }
        })
    } catch (err) {
        res.status(400).json({
            status: "failed",
            message: err
        })
    }

}

exports.updateTour = async (req, res) => {
    try {
        const updateTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
        res.status(200).json({
            status: "success",
            data: {
                tour: updateTour
            }
        })
    } catch (error) {
        res.send(404).json({
            status: "Failed",
            message: error
        })
    }
}

exports.deleteTour = async (req, res) => {
    try {
        const deletedTour = await Tour.findByIdAndDelete(req.params.id)
        res.status(204).json({
            status: "success",
            data: null
        })
    } catch (error) {
        res.send(404).json({
            status: "Failed",
            message: error
        })
    }
}

exports.getTourStats = async (req, res) => {
    try {
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
    } catch (error) {
        res.send(404).json({
            status: "Failed",
            message: error
        })
    }
}


exports.getMonthlyPlan = async (req, res) => {
    try {
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
    } catch (error) {
        res.send(404).json({
            status: "Failed",
            message: error
        })
    }
}