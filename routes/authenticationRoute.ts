import express from "express"
import {login,logout,sendOTP,signUp} from '../controllers/authentication'
import rateLimit from "express-rate-limit";

const authenticationRouter = express.Router();

const authenticationLimiter=rateLimit({
    windowMs:60 * 60 * 1000,
    limit:5,
    message:"You have reached the maximum limit of signup/login or resend OTP. Please, wait for sometime."
  })

authenticationRouter.post("/login",login);
authenticationRouter.post('/logout',logout);
authenticationRouter.post("/sendotp",authenticationLimiter,sendOTP);
authenticationRouter.post("/signup",authenticationLimiter,signUp);

export {authenticationRouter}