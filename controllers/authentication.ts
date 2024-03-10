import User from '../models/User';
import jwt from 'jsonwebtoken'
import otpGenerator from 'otp-generator';
import OTP from '../models/OTP';
import bcrypt from 'bcryptjs';
import {mailSender} from '../configuration/mailSender';


const sendOTP=async(req:any,res:any)=>{
    try {
        const{email}=req.body;
        const checkUserPresent=await User.findOne({email});
        if(checkUserPresent){
            return res.status(401).json({
                success:false,
                message:"Email is already registered"
            });
        }

        var otp=otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false
        });
        
        const result=await OTP.findOne({otp:otp});
        while(result){
            otp=otpGenerator.generate(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false
            });
        }
        const otpPayload={email,otp};
        const otpBody=await OTP.create(otpPayload);

        return res.status(200).json({
            success:true,
            message:"OTP sent successfully"
        })
    } catch (error:any) {
        
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

const signUp=async(req:any,res:any)=>{
    try {
        const{userName,email,password,otp}=req.body;

        if(!userName||!email||!password||!otp){
            return res.status(403).json({
                success:false,
                message:"Please fill all the fields"
            })
        }

        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(401).json({
                success:false,
                message:"User is already registered"
            })
        };

        const recentOTP=await OTP.find({email}).sort({createdAt:-1}).limit(1);
        if(recentOTP.length===0){
            return res.status(401).json({
                success:false,
                message:"OTP Error"
            })
        }else if(otp!==recentOTP[0].otp){
            return res.status(401).json({
                success:false,
                message:"Invalid OTP"
            })
        }

        var hashedPassword=await bcrypt.hash(password,10);
        

        const user=await User.create({userName,email,password:hashedPassword,
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${userName}`,userLoggedInCount:0
        });

        return res.status(200).json({
            success:true,
            message:"User registered successfully"
        })

    } catch (error:any) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

const login=async(req:any,res:any)=>{
    try {
        const{custom,password}=req.body;

        if(!custom||!password){
            return res.status(403).json({
                success:false,
                message:"Please fill all the fields"
            })
        }
        
        let user;
        if(custom.includes('@')){
            user=await User.findOne({email:custom});
            if(!user || (user && user.userLoggedInCount !== 0)){
                return res.status(401).json({
                    success:false,
                    message:"User not found"
                })
            }
        }else{
            user=await User.findOne({userName:custom});
            if(!user || (user && user.userLoggedInCount !== 0)){
                return res.status(401).json({
                    success:false,
                    message:"User not found"
                })
            }
        }

        if (password && user.password && await bcrypt.compare(password, user.password)) {
            const payload={
                email:user.email,
                id:user._id,
            }

            const updatedUser=await User.findByIdAndUpdate(user._id,{userLoggedInCount:1},{new:true});

            const jwt_secret=process.env.JWT_SECRET || '';
            const token=jwt.sign(payload,jwt_secret,{
                expiresIn:"2h",
            });
            user.token=token;
            user.password=undefined;

            const options={
                expires:new Date(Date.now()+3*24*60*60),
                httpOnly:true
            }
            res.cookie("token",token,options).status(200).json({
                success:true,
                user,
                token,
                message:"LoggedIn successfully"
            })
        }
        else{
            return res.status(401).json({
                success:false,
                message:"Passwords doesn't match"
            })
        }
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Login Failure"
        })
    }
}

const logout=async(req:any,res:any)=>{
    try {
        const{email}=req.body;

        const user=await User.findOne({email});
        if(!user){
            return res.status(401).json({
                success:false,
                message:"Couldn't logout, please try again."
            })
        }

        const updatedUser=await User.findByIdAndUpdate(user._id,{userLoggedInCount:0},{new:true});
        if(updatedUser){
            return res.status(200).json({
                success:true,
                message:"Logged out successfully"
            })
        }
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal error while logging you out."
        })
    }
}


export {sendOTP,signUp,login,logout};