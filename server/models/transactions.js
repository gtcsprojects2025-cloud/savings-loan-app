import mongoose, { now } from 'mongoose';
const { Schema } = mongoose;
 const transactionSchema = new Schema({
    email:{
        type: String,
        required: false
    },
    phoneNo:{
        type:String
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
        required: false,
        default: 0
    },
    transactionType:{
        type:String,
        required: true
    },
    comment:{
        type: String,
        required: false
    },
    guarantor:{
        type: String,
        required: false
    },
    interest:{
        type: String,
        required: false
    },
    dueDate:{
        type: String,
        required: false
    },
    status:{
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