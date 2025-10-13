import LoanDocument from "../models/loanDocument.js";
//import { v2 as cloudinary } from 'cloudinary'; // ✅ Correct
import cloudinary from '../cloudinary/cloudinaryConfig.js'
import TRANSACTION from "../models/transactions.js";
export async function uploadDocument(req, res) {
    console.log("running uploaddoc fn...")
    try {
    const { originalname, mimetype, size, buffer } = req.file;
    

    const doc = new LoanDocument({
      filename: req.file.filename || originalname,
      originalName: originalname,
      mimeType: mimetype,
      path:req.file.path,
      firstName: req.body.firstName,
      surName: req.body.surName,
      BVN:req.body.BVN,
      email: req.body.email,
      size
    });

    await doc.save();
    res.status(200).json({ message: 'File metadata saved successfully'});
  } catch (err) {
    res.status(500).json({ error: 'Upload failed', details: err.message });
  }
}


export async function fetchUserLoanApplicationDetails(req, res) {
  try {
        const email = req.query.email
        //const loan_details = await LoanDocument.find({email:email});
        const loan_details = await TRANSACTION.find({email:email})
        if(!loan_details) res.status(400).json({error: "User with this email does not exists"});
        res.status(200).json({loan_details}); 
  } catch (error) {
        res.status(500).json({error:"Server error try again later"});
        console.log("server error: ", error);     
  }
}

export async function fetchAllLoanApplicationDetails(req, res) {
    try {
        
        const all_loan_details = await LoanDocument.find({});
        if(!all_loan_details) res.status(400).json({error: "No loan application found"});
        res.status(200).json({all_loan_details}); 
  } catch (error) {
        res.status(500).json({error:"Server error try again later"});
        console.log("server error: ", error);     
  }
}

export async function personalLoanApplication(req, res) {
  const applicationDetails ={
    email: req.body.email,
    
    loanAmount: req.body.loanAmount,
    loanType: req.body.loanType,
    employmentStatus: req.body.employmentStatus,
    purpose: req.body.loanPurpose,
    monthlyIncome: req.body.monthlyIncome,
    bankName: req.body.bankName,
    accountHolder: req.body.accountHolder,
    accountNumber: req.body.accountNumber, 
  }

  try {
    const personalLoan = new LoanDocument(applicationDetails);
    await personalLoan.save()
    res.status(200).json({message: "Loan application successful"})
  } catch (error) {
    res.status(500).json({error:"Unsuccessfull try again"})
  }
}




