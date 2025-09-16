import mongoose, { now } from 'mongoose';
const { Schema } = mongoose;
 const transactionSchema = new Schema({
    email:{
        type: String,
        required: true
    },
    BVN:{
        type: Number,
        required: true
    },
    savingAmount:{
        type: Number,
        required:false
    },
    loanAmount:{
        type:Number,
        required: false
    },
    transactionType:{
        type:String,
        required: true
    },
    comment:{
        type: String,
        required: false
    },
    dateCreated:{
        type: Date,
        required: true
    }
 })

 const TRANSACTION = mongoose.model("TRANSACTION", transactionSchema );
  export default TRANSACTION;