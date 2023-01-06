const Tour = require("../models/tourModel");

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));


// 2) Route Handlers
exports.getAllTours= (req, res) => {
    res.status(200).json({
        status:'success', 
        requestedAt: req.requestTime,
        // results: tours.length,
        // data: {
        //     tours: tours
        // }
    })
}

exports.getTour = (req, res) => {
    const id = req.params.id * 1;
    // const tour = tours.find((el) => {
    //     return el.id === id;
    // })
    // res.status(200).json({
    //     status:'success', 
    //     data:{
    //          tour
    //     }
    // })
}

exports.createTour = async (req,res) => {
    try{
    //  create new tour document
        const newTour = await  Tour.create(req.body);
        res.status(201).json({
         status:"success",
         data:{
             tour:newTour
         }
        })
    }catch(err){
        res.status(400).json({
            status: "failed",
            message: "Invalid data dent!"
        })
    }
 
} 

exports.updateTour = (req,res)=> {

    res.status(200).json({
        status:"success", 
        data:{
            tour: "<Updated tour here...>"
        }
    })
}

exports.deleteTour = (req,res)=> {
    res.status(204).json({
        status:"success",
        data: null
    })
}