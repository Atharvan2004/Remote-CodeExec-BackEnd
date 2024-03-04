import mongoose from 'mongoose';
require('dotenv').config();

const dbConnect=async()=>{
    const mongodbUrl = process.env.MONGODB_URL || ''; 
    mongoose.connect(mongodbUrl, {}).then(()=>{console.log("db connection successfully established")})
    .catch((error)=>{
        console.error(error);
        console.log("DB connection failed");
        process.exit(1);
    })
}

export default dbConnect;
