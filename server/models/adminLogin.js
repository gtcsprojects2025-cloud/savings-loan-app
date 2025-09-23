import mongoose from 'mongoose';
const { Schema } = mongoose;
 const adminLoginSchema = new Schema({
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
 })

 const AdminLogin = mongoose.model("AdminLogin", adminLoginSchema);
  export default AdminLogin;