import mongoose,{Document,Schema} from "mongoose";
import { mailSender } from "../configuration/mailSender";

interface IOTP extends Document{
    email:string;
    otp:string;
    createdAt:Date;
}

const otpSchema=new Schema<IOTP>({
    email:{
        type:String,
        required:true,
        trim:true
    },
    otp:{
        type:String,
        required:true,
        trim:true
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:5*60
    }
});


async function sendVerificationMail(email:string,otp:string){
    try {
        const emailResponse=await mailSender(email,"Email Verification",`Your OTP is ${otp}`);
        console.log("emailResponse:",emailResponse);
    } catch (error) {
        throw error;
    }
}

otpSchema.pre("save",async function(this:any,next:any){
    if(this.isNew){
        try {
            await sendVerificationMail(this.email,this.otp);
        } catch (error) {
            next(error);
        }
    }
});

export default mongoose.model<IOTP>("OTP",otpSchema);