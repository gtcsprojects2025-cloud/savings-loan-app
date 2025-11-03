
import express from "express"; // ✅


import multer from "multer"

import { connectDB } from "./db.js";

import cloudinary from './cloudinary/cloudinaryConfig.js';
import{ registerMember, memberLogin, generateOTP, verifyOTP, updatePassword, getUser, getAllUsers, updateUserRecords, adminLogin } from "./controllers/profileController.js";

import cors from 'cors';

import { create_account, transaction, getUserAmount, getTransactionHistory, getAllMembersTransactions, getUserAccountRecords } from "./controllers/accountController.js";
import { uploadDocument, fetchUserLoanApplicationDetails, fetchAllLoanApplicationDetails,  personalLoanApplication } from "./controllers/documentController.js";
import LoanDocument from "./models/loanDocument.js";
// import { sendMail, sendSMS, twiliosms } from "./controllers/sendGrid.js";



const PORT = process.env.PORT || 5001
const app = express()


const allowedOrigins = [
  'http://localhost:3000',
  'https://savings-loan-app-n3mm.vercel.app'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'OPTIONS'],
 // allowedHeaders: ['Content-Type'],
  credentials: false // If you're using cookies or auth headers
};

//var jsonParser = bodyParser.json()

// const storage = multer.diskStorage({
//   destination: function(req, file, cb){
//     cb(null, './upload/');
//   },
//   filename: function(req, file, cb){
//     const now = new Date().toISOString();
//     const date = now.replace(/:/g,'_')
//     cb(null, date + file.originalname);
//   }
// })
//const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

//const upload = multer({storage: storage})

app.use(cors(corsOptions));

app.get("/", (req, res)=>{
    res.send("root end-point changed")
})
app.get("/api/register", (req, res)=>{
   res.status(201).send({ message: 'User created'});
})
// middleware
app.use(express.urlencoded({ extended: true })); // 👈 Parses URL-encoded bodies
app.use(express.json())
app.use('/upload', express.static('upload'))
app.post("/api/register", registerMember)
// app.post('/api/sendmsg', sendMessage)
// app.post('/api/sms', twiliosms)
app.post("/api/login", memberLogin)
app.post('/api/generate-otp', generateOTP);
app.post("/api/verify-otp", verifyOTP);
app.post("/api/create-user-account", create_account);
app.post("/api/admin-login", adminLogin)
app.post('/api/personal-loan-application', personalLoanApplication)
app.post('/api/upload-loan-application-doc', upload.single('file'), async (req, res) => {
  try {
    const { email, firstName, surName, BVN } = req.body;

    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { resource_type: 'raw' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        ).end(buffer);
      });
    };

    const result = await streamUpload(req.file.buffer);

    const doc = new LoanDocument({
      path: result.secure_url,
      firstName,
      surName,
      BVN,
      email,
    });

    await doc.save();

    res.status(200).json({message:"application sent successfully"});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.get("/api/get-user-amount", getUserAmount)
app.get("/api/get-transaction-history", getTransactionHistory)
app.get("/api/get-user/", getUser)
app.get("/api/get-all-users", getAllUsers)
app.get("/api/get-all-members-transactions", getAllMembersTransactions)
app.get("/api/get-user-account-records", getUserAccountRecords)
app.get("/api/fetch-user-loan-details", fetchUserLoanApplicationDetails)
app.get("/api/fetch-all-user-loan-data", fetchAllLoanApplicationDetails)

app.put("/api/transaction", transaction)
app.put("/api/update-password", updatePassword)
app.put("/api/update-user-records", updateUserRecords)

// app.post('/api/sendMail', sendMail)



connectDB().then(()=>{
    app.listen(PORT, console.log(`Server is running on port ${PORT}`));
    //module.exports = app; // ✅ Export instead of listen
})