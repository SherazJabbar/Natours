const { query } = require("express");
const Tour = require("../models/tourModel");

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));


// 1) Route Handlers
exports.getAllTours = async (req, res) => {
    try {
        console.log(req.query)
        // 1A) Filtering
        const queryObj = { ...req.query };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el])

        // 1B) Advanced Filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        let query = Tour.find(JSON.parse(queryStr));
        // const query = Tour.find().where('duration').equals(5).where('difficulty').equals('easy')

        // 2) Sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            console.log("sortBy", sortBy);
            query = query.sort(sortBy);
        } else {
            query = query.sort(-createdAt);
        }

        const tours = await query;

        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: {
                tours: tours
            }
        })
    } catch (err) {
        res.send(404).json({
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