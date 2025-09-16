const express = require("express")
const { connectDB } = require("./db");
const { registerMember, memberLogin, generateOTP, verifyOTP, updatePassword } = require("./controllers/profileController.js");

require('dotenv').config();
const cors = require('cors');
const { create_account, transaction, getUserAmount, getTransactionHistory } = require("./controllers/accountController.js");



PORT = process.env.PORT || 5001
const app = express()
/*const corsOptions = {
  origin: [`http://localhost:3000`, "https://savings-loan-app-n3mm.vercel.app/"], // Allow only this origin
  methods: ['GET', 'POST', 'PUT'],        // Allowed HTTP methods
  allowedHeaders: ['Content-Type']               // Allow cookies/auth headers
};*/

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
  methods: ['GET', 'POST', 'PUT'],
  allowedHeaders: ['Content-Type'],
  credentials: false // If you're using cookies or auth headers
};


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

app.post("/api/register", registerMember)
app.post("/api/login", memberLogin)
app.post('/api/generate-otp', generateOTP);
app.post("/api/verify-otp", verifyOTP);
app.post("/api/create-user-account", create_account)

app.get("/api/get-user-amount", getUserAmount)
app.get("/api/get-transaction-history", getTransactionHistory)

app.put("/api/transaction", transaction)
app.put("/api/update-password", updatePassword)

connectDB().then(()=>{
    app.listen(PORT, console.log(`Server is running on port ${PORT}`));
    //module.exports = app; // ✅ Export instead of listen
})