import express, { Application , Request , Response } from "express"
import dotenv from "dotenv"
import connectDB from "./db";
import router from "./routes";
import bodyParser from "body-parser";
import cors from "cors";
dotenv.config({path:".env.local"})


const app : Application  = express ();
app.use(bodyParser.json());
app.use(cors({
    origin: "*",
}))
const port   = process.env.PORT  ; 

app.use("/",router)

connectDB();

app.listen(port,()=>{
    console.log(`backend is live on ${port}`)
});