import mongoose from 'mongoose';
const { Schema } = mongoose;
 const loginSchema = new Schema({
    email:{
        type: String,
        required: false
    },
    phoneNo:{
        type: String,
        required: false
    },
    password:{
        type: String,
        required: true
    },
 })

 const Login = mongoose.model("Login", loginSchema);
  export default Login;