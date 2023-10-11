import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/auth.js";
import usersRoute from "./routes/users.js";
import hotelsRoute from "./routes/hotels.js";
import roomsRoute from "./routes/rooms.js";
import cookieParser from "cookie-parser";

dotenv.config() 
const app = express();
const connect = async () =>{
    try {
        await mongoose.connect(process.env.MONGO);
        console.log("Conectados a MONGODB");
        } catch (error) {
        //handleError(error);
        throw error;
        }
}
mongoose.connection.on('connected',()=>{
    console.log("MongoDB Conectado!!!");
})
mongoose.connection.on('disconnected',()=>{
    console.log("MongoDB Desconectado!!!");
})

//middLewares
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth",authRoute);
app.use("/api/users",usersRoute);
app.use("/api/hotels",hotelsRoute);
app.use("/api/rooms",roomsRoute);

app.use((err, req, res, next) => {
    const errorStatus = err.status || 500
    const errorMessage = err.message || "Servidor no disponoble"
    return res.status(errorStatus).json({
        message: errorMessage, 
        status: errorStatus,
        success: false,
        stack: err.stack
    })
})


app.listen (process.env.PORT, ()=>{
    connect()
    console.log('Conectado al backend  on port : '+process.env.PORT)
})