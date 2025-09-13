const express = require("express")
const { connectDB } = require("./db");
const { registerMember, memberLogin } = require("./controllers/profileController.js");
require('dotenv').config();
const cors = require('cors');
const { default: Login } = require("./models/login.js");


PORT = process.env.PORT || 5001
const app = express()
const corsOptions = {
  origin: `http://localhost:${process.env.PORT}`, // Allow only this origin
  methods: ['GET', 'POST', 'PUT'],        // Allowed HTTP methods
  credentials: false                // Allow cookies/auth headers
};

app.use(cors(corsOptions));

app.get("/", (req, res)=>{
    res.send("root endpoint")
})
app.get("/api/register", (req, res)=>{
   res.status(201).send({ message: 'User created'});
})
// middleware
app.use(express.urlencoded({ extended: true })); // 👈 Parses URL-encoded bodies
app.use(express.json())

app.post("/api/register", registerMember)
app.post("/api/login", memberLogin)

connectDB().then(()=>{
    app.listen(PORT, console.log(`Server is running on port ${PORT}`))
})