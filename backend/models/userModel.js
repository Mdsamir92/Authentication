import mongoose from "mongoose"

const userSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    mobile: {
        type: Number,
        required: true,
    },
    role:{
        type:String,
        enum:["user","owner","deliveryBoy"],
        required:true,

    },
    resetOtp : {
        type: Number,
    },

    isOtpVerified : {
        type:Boolean,
        default:false
    },

    otpExpires:{
        type:Date
    },

}, {timestamps:true})

const User = mongoose.model("User", userSchema);

export default User;