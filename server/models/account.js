import mongoose, { now } from 'mongoose';
const { Schema } = mongoose;
 const accountSchema = new Schema({
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
        required:true,
        default:0
    },
    loanAmount:{
        type:Number,
        required: false,
        default:0
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

 const ACCOUNT = mongoose.model("ACCOUNT", accountSchema );
  export default ACCOUNT;