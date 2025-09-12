// Correct for ES Modules
import mongoose from 'mongoose';
const { Schema } = mongoose;
 const registerSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    otherNames:{
        type: String,
        required: true
    },
     DOB:{
        type: Date,
        required: true
    },
     email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
     phoneNo:{
        type: Number,
        required: true
    },
    phoneNo2:{
        type: Number,
        required: false
    },

    NIN:{
        type: String,
        required: true
    },
     BVN:{
        type: String,
        required: true
    },
     residentialAddress:{
        type: String,
        required: true
    },
     residentialState:{
        type: String,
        required: true
    },
     officeAddress:{
        type: String,
        required: false
    },
    referenceName:{
        type: String,
        required: false
    },
    referencePhoneNo:{
        type: Number,
        required: false
    },
     guarantorName:{
        type: String,
        required: true
    },
    guarantorPhone:{
        type: String,
        required: true
    },
    guarantorName2:{
        type: String,
        required: false
    },
    guarantorPhone2:{
        type: String,
        required: false
    },

 });

 const Register = mongoose.model("Register", registerSchema);
 export default Register;