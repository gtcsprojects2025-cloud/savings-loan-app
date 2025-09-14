import express from "express";
import { registerMember } from "../controllers/profileController.js";
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');

const router = express.Router();

router.post("/", registerMember);


export default router;