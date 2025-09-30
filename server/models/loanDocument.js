// models/Document.js
import mongoose from 'mongoose';
const { Schema } = mongoose;
 const loanDocumentSchema = new Schema({

  path: String,
  firstName: String,
  surName: String,
  BVN: Number,
  email:String,
  uploadDate: {
    type: Date,
    default: Date.now
  }
})

 const LoanDocument = mongoose.model("LoanDocument", loanDocumentSchema);
  export default LoanDocument;