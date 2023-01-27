const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "A tour must have a name"],
        unique: true,
        trim: true
    },
    slug: String,
    duration: {
        type: Number,
        required: [true, "A tour must have a durations"]
    },
    maxGroupSize: {
        type: Number,
        required: [true, "A tour must have a group size"]
    },
    difficulty: {
        type: String,
        required: [true, "A tour must have a difficulty"]
    },
    ratingsAverage: {
        type: Number,
        default: 4.5
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, "A tour must have a price"]
    },
    priceDiscount: Number,
    summary: {
        type: String,
        trim: true,
        required: [true, 'A tour must have a description']
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have a cover image']
    },
    images: [
        String
    ],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// virtual properties are not stored in db
tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
});

// Document middleware: only runs before .save() and .create() command
// It doesn't work on insertMany(), findOne(), findOneAndUpdate(), findByIdAndUpdate()
tourSchema.pre('save', function (next) {
    // In save event this keyword refers to the document that is to be saved
    this.slug = slugify(this.name, { lower: true });
    next();
})

// We can have multiple middlewares for same hook. hooks ---> 'save' , 'post'
// tourSchema.pre('save', function (next) {
//     console.log("Will save document...");
//     next();
// })

// Post middleware functions are executed when all pre-middlewares are executed
// tourSchema.post('save', function (doc, next) {
//     console.log(doc);
//     next();
// })

// Query MiddleWare

tourSchema.pre('find', function (next) {

    next();
})

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;