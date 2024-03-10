import { mailSender } from "../configuration/mailSender";
import User from "../models/User";
import crypto from 'crypto';
import bcrypt from 'bcryptjs'
import { BASE_URL } from "../utils/config";


const resetPasswordToken=async(req:any,res:any)=>{
    try {
        const email=req.body.email;
        const user=await User.findOne({email:email});
        if(!user){
            return res.status(404).json({
                success:true,
                message:"Email not found"
            })
        }
        const token=crypto.randomBytes(20).toString("hex");
        const updatedDetails=await User.findByIdAndUpdate({_id:user._id},            
            {
                resetToken:token,
                resetPasswordExpires: new Date(Date.now() + 3600000),
            },
            {new:true}
        );

        const resetUrl=`${BASE_URL}/update-password/${token}`;
        await mailSender(email,"Password Reset Link",`Password Reset link:\n ${resetUrl}`);

        return res.status(200).json({
            success:true,
            message:"Email sent successfully,please check your email"
        })

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Something went wrong while reset of password"
        })
    }
}

const resetPassword=async(req:any,res:any)=>{
    try {
        const {password,confirmPassword,token}=req.body;

        if(password!==confirmPassword){
            return res.json({
                success:false,
                message:"Password not matching"
            })
        };

        const userDetails=await User.findOne({resetToken:token});
        if (!userDetails) {
            res.status(401).json({
                success: false,
                message: "Invalid token"
            });
        }
        if (!(userDetails?.resetPasswordExpires ?? new Date() > new Date())) {
            res.status(401).json({
                success: false,
                message: "Reset Link is expired, please try again later"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const upadtedUserDetails=await User.findByIdAndUpdate({_id:userDetails?._id},
            {password:hashedPassword},
            {new:true}
        );

        return res.status(200).json({
            success:true,
            message:"Password updated successfully"
        });
    } catch (error:any) {
        return res.status(200).json({
            success:false,
            message:error.message
        })
    }
}

export {resetPasswordToken,resetPassword};