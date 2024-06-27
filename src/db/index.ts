import mongoose from "mongoose"
import dotenv, { config } from  "dotenv"

dotenv.config({path:".env.local"})


const uri  = process.env.URI as string;

const connectDB = async ()=>{

    try {        
        mongoose.connect(uri)
        console.log("database connected")
    } catch (error: string | any) {
        console.log("database error", error.message)
    }
}

export default connectDB ;