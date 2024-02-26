const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./db/connect");
const userRouter = require("./routes/user");
const errorHandler = require("./middleware/errorHandler");

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true
}))

app.use(errorHandler)
app.use(userRouter);

try{
    connectDB(process.env.MONGO_URI);
}catch(e){
    console.log(e);
}

app.listen(process.env.PORT, ()=>{
    console.log("Server running on port "+ process.env.PORT)
})