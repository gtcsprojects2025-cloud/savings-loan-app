// models/Document.js
import mongoose from 'mongoose';
const { Schema } = mongoose;
 const loanDocumentSchema = new Schema({
  filename: String,
  originalName: String,
  mimeType: String,
  size: Number,
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