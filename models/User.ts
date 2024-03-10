import mongoose, {Document,Schema} from "mongoose";

interface IUser extends Document{
    userName:string;
    email:string;
    password:string|undefined;
    image:string;
    token?:string;
    resetToken?:string;
    resetPasswordExpires?:Date;
    userLoggedInCount:number;
}



const userSchema=new Schema<IUser>({
    userName:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        trim:true
    },
    image:{
        type:String,   
    },
    resetToken:{
        type:String,
    },
    resetPasswordExpires:{
        type:Date,
    },
    userLoggedInCount:{
        type:Number,
        default:0
    }
},
{timestamps:true});

export default mongoose.model<IUser>("User",userSchema);