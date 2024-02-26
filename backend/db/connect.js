const mongoose = require("mongoose");

const connectDB = async(uri)=>{
    await mongoose.connect(uri)
    .then(()=>{
        console.log("DB connected");
    })
    .catch((e)=>{
        console.log(e);
    })
}

module.exports = connectDB;