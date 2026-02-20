import ACCOUNT from "../models/account.js"
import TRANSACTION from "../models/transactions.js";
import mongoose from "mongoose";
import nodemailer from "nodemailer"


import dotenv from 'dotenv';
import { sendMail, sendSMSNG } from "./sendGrid.js";
import Register from "../models/register.js";
dotenv.config();

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


export async function create_account(req, res) {
    try {
        const account_details = {
            email:req.body.email,
            phoneNo:req.body.phoneNo,
            BVN:req.body.BVN,
            savingAmount:req.body.savingAmount,
            loanAmount:req.body.loanAmount,
            transactionType:req.body.transactionType,
            comment: req.body.comment,
            dateCreated:new Date()
        }

            const mailOptions = {
                from: "rolandmario2@gmail.com",
                to: req.body.email,
                subject: 'GTCS Account Creation',
                text: `Your GTCS Account has been created succesfully with the initial saving deposit of ${req.body.savingAmount}`,
            };
         const emailBody = `
         <div>
         <p>Dear ${req.body.email || req.body.phoneNo},</p>
            <p> Your Account has been successfully created with the initial Amount of NGN ${req.body.savingAmount}.00</p>
            <p>Loan amount of NGN ${req.body.loanAmount}.00</p>
            <p>Date: ${Date.now}</p>
         </div>
`

const smsBody =`Dear ${req.body.email || req.body.phoneNo}
            Your Account has been successfully created with the initial Amount of NGN ${req.body.savingAmount}.00
            Loan amount of NGN ${req.body.loanAmount}.00
            Date: ${Date.now}
`
        const userRegistered = await Register.findOne({BVN: req.body.BVN})
        console.log("registered pnone No", userRegistered.phoneNo)

        if(!userRegistered) res.status(400).json({message: 'User Not Yet Registered !'})
        const acountExists = await ACCOUNT.findOne({BVN: req.body.BVN});
        console.log("accountInfo: ", acountExists, userRegistered.phoneNo)
        if(acountExists){
            res.status(400).json({message:"User account Already Exists"})
        }else{
        const details = new ACCOUNT(account_details);
        const transaction_details = new TRANSACTION(account_details);
        await details.save();
        await transaction_details.save();
        // await transporter.sendMail(mailOptions);
        await sendSMSNG(`+${req.body.phoneNo}`, smsBody)
        if(req.body.email){
            await sendMail(req.body.email, 'GTCS Account Creation', 'Account created successfully', emailBody)
            await sendSMSNG(`+${req.body.phoneNo}`, smsBody)
        res.status(200).json({message:"Account created successfully"}) 
        
        }else{
            await sendSMSNG(req.body.phoneNo, smsBody)
           res.status(200).json({message:"Account created successfully"})  
        }
        }

    } catch (error) {
        res.status(500).json({message: "Server Error pls try again"})
        console.log("server error", error)
    }
}

export async function transaction(req, res) {

    try {

        const account_details = {
            email:req.body.email,
            BVN:req.body.BVN,
            savingAmount:req.body.savingAmount,
            loanAmount:req.body.loanAmount,
            transactionType:req.body.transactionType,
            comment: req.body.comment,
            status: req.body.status,
            dueDate: req.body.dueDate,
            interest:req.body.interest,
            guarantor:req.body.guarantor,
            dateCreated:new Date()
        }

         const emailBody = `
         <div>
         <h2>Deposit Alert!</h2>
         <p>NGN ${req.body.savingAmount}.00 has been added to your GTCS Saving Account</p>
         <p> Date: ${Date.now}</p>
         </div>
         `
         const smsBody =`Deposit Alert!
         NGN ${req.body.savingAmount}.00 has been added to your GTCS Saving Account.
          Date: ${Date.now}
`
    const mailOptions = {
        from: '"GTCS SUPPORT" <rolandmario2@gmail.com>',
        to: req.body.email,
        subject: 'GTCS Account Creation',
        text: `A successfull transaction has been completed on your GTCS account`,
    };
        if(req.body.transactionType==="deposit"){
        //find account records
        console.log("validating records")
        const account_records = await ACCOUNT.findOne({BVN: req.body.BVN});
        console.log("validated...")
        if(!account_records){
            res.status(400).json({message: "account not found"});
            console.log("records not found")
        }else{
            console.log("proccessing records")
            const depositAmount = Number(req.body.savingAmount);
            const loanDepositAmount = Number(req.body.loanAmount);
            const depositAccount = await ACCOUNT.updateOne(
            { BVN: req.body.BVN }, // Filter
            {
                $inc: {
                savingAmount: depositAmount,
                loanAmount: loanDepositAmount
                }
            }
            );
             console.log("Account updated")
             const phone = await Register.findOne()
             await sendSMSNG(req.body.phoneNo, smsBody)
            if (!depositAccount) return res.status(404).json({message:'User not found'});
            res.status(200).json({ message: 'Deposit successfully!' });
            const transaction_details = new TRANSACTION(account_details);
            await transaction_details.save();
            //  await transporter.sendMail(mailOptions);
            await sendMail(req.body.email, 'Deposit Transaction', 'Deposit', emailBody)
            await sendSMSNG(req.body.phoneNo, smsBody)
        }
        }else if(req.body.transactionType==="withdraw"){
            // withdraw logic
        console.log("validating records")
        const account_records = await ACCOUNT.findOne({BVN: req.body.BVN});
        console.log("validated...")
        if(!account_records){
            res.status(400).json({message: "account not found"});
            console.log("records not found")
        }else{
            console.log("proccessing records")
            const withdrawalAmount = Number(req.body.savingAmount);
            const loanDepositAmount = Number(req.body.loanAmount);
            const withdrawAccount = await ACCOUNT.updateOne(
             { BVN: req.body.BVN },           // Filter
             { $inc: { savingAmount: -withdrawalAmount, loanAmount: -loanDepositAmount} } );
             console.log("Account updated")
            if (!withdrawAccount) return res.status(404).json({message:'User not found'});
            res.status(200).json({ message: 'Withdrawal successfully!' });
            const transaction_details = new TRANSACTION(account_details);
            await transaction_details.save();
            await transporter.sendMail(mailOptions);
           
        }
        }else{
            // transfer logic
            const { senderBVN, receiverBVN, amount } = req.body;
            const transferAmount = Number(amount);
            
            
            if (!Number(senderBVN) || !Number(receiverBVN) || isNaN(transferAmount) || transferAmount <= 0) {
            return res.status(400).json({ error: "Invalid transfer details" });
            }
            
            //Fetching both accounts
            const sender = await ACCOUNT.findOne({ BVN:Number(senderBVN) });
            const receiver = await ACCOUNT.findOne({ BVN:Number(receiverBVN) });
            console.log({sender: sender, receiver:receiver})

            if (!sender || !receiver) {
            return res.status(404).json({ error: "One or both accounts not found" });
            }

            // Checking sender's balance
            if (Number(sender.savingAmount) < transferAmount) {
            return res.status(400).json({ error: "Insufficient funds" });
            }

                // Performing the transaction
            const session = await mongoose.startSession();
            session.startTransaction();

            try {
            await ACCOUNT.updateOne(
                { BVN: Number(senderBVN) },
                { $inc: { savingAmount: -transferAmount } },
                { session }
            );

            await ACCOUNT.updateOne(
                { BVN: Number(receiverBVN) },
                { $inc: { savingAmount: transferAmount } },
                { session }
            );

            await session.commitTransaction();
            session.endSession();

            res.status(200).json({ message: "Transfer successful" });
            } catch (error) {
            await session.abortTransaction();
            session.endSession();
            console.error("Transfer failed:", error);
            res.status(500).json({ error: "Transfer failed" });
            }

        }

    } catch (error) {
        res.status(500).json({message: 'Error performing this transaction'});
    }

}


export async function getUserAmount(req, res) {
    try {
        const email = req.query.email
        const fetch_details = await ACCOUNT.findOne({email:email});
        if(!fetch_details) res.status(400).json({error: "User with this email does not exists"});
        res.status(200).json({fetch_details});
        
        
    } catch (error) {
        res.status(500).json({error:"Server error try again later"});
        console.log("server error: ", error);
    }
}


export async function getTransactionHistory(req, res) {
    try {
        const email = req.query.email
        const transaction_details = await TRANSACTION.find({email:email});
        if(!transaction_details) res.status(400).json({error: "User with this email does not exists"});
        res.status(200).json({transaction_details});        
    } catch (error) {
        res.status(500).json({error:"Server error try again later"});
        console.log("server error: ", error);        
    }
}

export async function getAllMembersTransactions(req, res) {
    try {
    const allMembersTx = await TRANSACTION.find({})
    if(!allMembersTx) res.status(400).json({message: "No member transaction found on the database"})
    res.status(200).json(allMembersTx)
  } catch (error) {
    res.status(500).json({error: "server error try again or contact admin"})
  }
}


export async function getUserAccountRecords(req, res) {
    try {
    const allAccountRecords = await ACCOUNT.find({})
    if(!allAccountRecords) res.status(400).json({message: "Account Not found on the database"})
    res.status(200).json(allAccountRecords)
  } catch (error) {
    res.status(500).json({error: "server error try again or contact admin"})
  }
}







// Start the server

