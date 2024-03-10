import express from "express"
import { resetPassword, resetPasswordToken } from "../controllers/resetPassword";
import rateLimit from "express-rate-limit";


const userRouter = express.Router();
const userLimiter=rateLimit({
    windowMs:24 * 60 * 60 * 1000,
    limit:3,
    message:"You have reached the maximum limit to change or forgot the password. Please, wait for sometime."
  })

userRouter.route("/resetpassword-token").post(userLimiter,resetPasswordToken);
userRouter.route("/resetpassword").post(userLimiter,resetPassword);


export {userRouter}