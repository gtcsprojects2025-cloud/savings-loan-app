
import Login from "../models/login.js";
import Register from "../models/register.js";
//const Login = require("../models/login.js")

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
        if(emailExists){
            res.send({"message": "user with this email already exist try another email"})
        }else{
         const memberRecords = new Register(newMember);
         await memberRecords.save();
         res.send("Member register successfully!")
        }

    } catch (error) {
        console.log("An error occured when trying to regiter member", error)
    }
}

export async function memberLogin(req, res){
    try {
       
       const user = await Register.findOne({email: req.body.email?.trim()});
            if(!user){
                res.status(403).json({ message: 'User NOT found!' });
            }else{
                if (user.password === req.body.password) {
                console.log("Login successful:");
                res.status(200).json({ message: 'Login was successful!' });
                } else {
                res.status(403).json({ message: 'Wrong login credentials!' });
                }
            }


    } catch (error) {
        res.status(503).json({ message: 'Server Error. Contact Admin' });
        console.log("Server issues: ", error)
    }

}