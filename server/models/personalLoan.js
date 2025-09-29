import mongoose, { now } from 'mongoose';
const { Schema } = mongoose;
 const personalLoanSchema = new Schema({
    email:{
        type: String,
        required: true
    },
    BVN:{
        type: Number,
        required: true
    },
    loanAmount:{
        type:Number,
        required: false
    },
    loanType:{
        type:String,
        required: true
    },
    employmentStatus:{
        type:String,
        required: true
    },
    loanPurpose:{
        type: String,
        required: false
    },
    monthlyIncome:{
        type:Number,
        required: true
    },
    BankName:{
        type:String,
        required: true
    },
    accountName:{
        type:String,
        required: true
    },
    accountNumber:{
        type:String,
        required: true
    },
    dateCreated:{
        type: Date,
        required: true
    }
 })

 const PERSONAL_LOAN = mongoose.model("PERSONAL_LOAN", personalLoanSchema );
  export default PERSONAL_LOAN;