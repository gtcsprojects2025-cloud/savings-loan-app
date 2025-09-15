import mongoose from "mongoose";

export const connectDB = async()=>{
    try {
       await  mongoose.connect('mongodb+srv://gtcsprojects2025_db_user:TA0xIxQ2immH4jNj@cluster0.xedc4fq.mongodb.net/GTCS_account?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true });
       console.log("Database connected successfully");
} 
    catch (error) {
        console.log(error)
    }
}