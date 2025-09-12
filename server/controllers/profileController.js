
import Register from "../models/register.js";


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
         const memberRecords = new Register(newMember);
         await memberRecords.save();
         res.send("Member register successfully!")
    } catch (error) {
        console.log("An error occured when trying to regiter member", error)
    }
}