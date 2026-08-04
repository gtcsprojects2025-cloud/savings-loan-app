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
    verified:{
        type: Boolean,
        default: false
    },
    createdAt:{
        type: Date,
        default: Date.now,
        expires: 900 // Auto-delete after 15 minutes (TTL index)
    }
 })

 const OTP = mongoose.model("OTP", otpSchema );
  export default OTP;