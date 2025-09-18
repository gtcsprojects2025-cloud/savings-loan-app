
import Login from "../models/login.js";
import Register from "../models/register.js";
import otpGenerator from "otp-generator";
import nodemailer from "nodemailer"
import OTP from "../models/otp.js";


export async function registerMember(req, res) {
    const newMember ={title:req.body.title, firstName:req.body.firstName,
           lastName:req.body.lastName, otherNames:req.body.otherNames,
           DOB:req.body.DOB, email:req.body.email, password:req.body.password,
           phoneNo:req.body.phoneNo, phoneNo2:req.body.phoneNo2,
           NIN:req.body.NIN, BVN:req.body.BVN, residentialAddress:req.body.residentialAddress,
           residentialState:req.body.residentialState, officeAddress:req.body.officeAddress,
           referenceName:req.body.referenceName, referencePhoneNo:req.body.referencePhoneNo,
           guarantorName:req.body.guarantorName, guarantorPhone:req.body.guarantorPhone,
           guarantorName2:req.body.guarantorName2, guarantorPhone2:req.body.guarantorPhone2}

    try {
        const emailExists = await Register.findOne({email: req.body.email})
        console.log("Member Already exists", emailExists)
        if(emailExists.email===req.body.email){
            
            res.status(400).json({ message: 'user with this email already exist try another email' });
        }else{
         const memberRecords = new Register(newMember);
         await memberRecords.save();
         res.status(200).json({message: 'Member registration successfull'})
        }

    } catch (error) {
        console.log("An error occured when trying to regiter member", error)
        res.status(501).json({message: 'server error try again later'})
    }
}

export async function memberLogin(req, res){
    try {
       
       const user = await Register.findOne({email: req.body.email?.trim()});
            if(!user){
                res.status(403).json({ message: 'User NOT found!' });
            }else{
              console.log("password", user.password, req.body.password)
                if (user.password === String(req.body.password)) {
                console.log("Login successful:");
                res.status(200).json({ message: 'Login was successful!' });
                } else {
                res.status(405).json({ message: 'Wrong login credentials!' });
                }
            }


    } catch (error) {
        res.status(503).json({ message: 'Server Error. Contact Admin' });
        console.log("Server issues: ", error)
    }

}

export async function generateOTP(req, res){
    try {
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: 'Email is required' });

  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
  });
console.log("otp :", otp)
  // Send OTP via email (or SMS)
  const transporter = nodemailer.createTransport({
    secure:false,
    host: 'smtp.gmail.com',
    port:587,
    requireTLS:true,
    logger: true,
    debug:true,
    auth: {
      user: 'rolandmario2@gmail.com',
      pass: 'nnlykezsxuhyibbp',
    },


  });
    const mailOptions = {
    from: "rolandmario2@gmail.com",
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP is: ${otp}`,
  };

/* function sendMail(to, sub, msg){
   transporter.sendMail({
      to: to,
      subject: sub,
      html:msg
    })
  }*/

   const otpRec = {email:req.body.email, otp}
   const newOTP = new OTP(otpRec)
  
    await transporter.sendMail(mailOptions);
    await newOTP.save();//sendMail(email, "Your OTP Code", otp)
    res.status(200).json({ message: 'OTP sent successfully'}); // Don't send OTP in production!
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to send OTP' });
  }
}

export async function verifyOTP(req, res) {
    try {
               const user = await OTP.findOne({email: req.body.email?.trim()});
            if(!user){
                res.status(403).json({ message: 'User has NOT requested OTP!' });
            }else{
                if (user.otp === req.body.otp) {
                console.log("OTP Verification successful:");
                res.status(200).json({ message: 'OTP verification  was successful!' });
                } else {
                res.status(400).json({ message: 'Wrong OTP!' });
                }
            }
    } catch (error) {
        res.status(503).json({ message: 'Server Error. Contact Admin' });
        console.log("Server issues: ", error)
    }
}


// update your forgotten password

export async function updatePassword(req, res) {
    try {
   
    const updatedUser = await Register.updateOne(
     { email: req.body.email },           // Filter
     { $set: { password: req.body.password } } );

    if (!updatedUser) return res.status(404).json({message:'User not found'});
    res.status(200).json({ message: 'password updated successfully!' });
    } catch (error) {
        res.status(500).json({message: 'Error updating user'});
    }
}


export async function getUser(req, res) {
  try {
    const {email} = req.body
    const userExist = await Register.findOne({email: email});
    if(!userExist) res.status(400).json({error: "User does not exist"});
    res.status(200).json({userExist})
  } catch (error) {
    res.status(500).json({error: "Server issue try again"})
    console.log("server error: ", error)
  }
}

export async function getAllUsers(req, res) {
  try {
    const allUsers = await Register.find({})
    if(!allUsers) res.status(400).json({message: "User member found on the database"})
    res.status(200).json(allUsers)
  } catch (error) {
    res.status(500).json({error: "server error try again or contact admin"})
  }
}