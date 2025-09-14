import mongoose from 'mongoose';
const { Schema } = mongoose;
 const otpSchema = new Schema({
    email:{
        type: String,
        required: true
    },
    otp:{
        type: String,
        required: true
    },
 })

 const OTP = mongoose.model("OTP", otpSchema );
  export default OTP;