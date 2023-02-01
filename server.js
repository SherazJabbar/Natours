const mongoose = require('mongoose');
const dotenv =require('dotenv');
dotenv.config({path:'./config.env'})

const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB, {
    useNewUrlParser:true,
    useCreateIndex: true, 
    useFindAndModify: false
}).then(con => {
    console.log(con.connections);
    console.log("DB connection successful")
})


const port = process.env.PORT;
app.listen(port, () => {
    console.log(`App running on port ${port}...`)
})

// Test

