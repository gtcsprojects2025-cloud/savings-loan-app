// models/Document.js
import mongoose from 'mongoose';
const { Schema } = mongoose;
 const loanDocumentSchema = new Schema({

  path: String,
  firstName: String,
  surName: String,
  BVN: Number,
  email:String,
  loanType: String,
  loanAmount: Number,
  purpose: String,
  employmentStatus: String,
  monthlyIncome: Number,
  accountHolder: String,
  bankName: String,
  accountNumber: String,
  createdAt :{
    type: Date,
    default: Date.now
  }
})

 const LoanDocument = mongoose.model("LoanDocument", loanDocumentSchema);
  export default LoanDocument;
  