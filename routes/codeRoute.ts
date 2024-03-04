import express from "express"
import {codeRunner}  from "../controllers/codeController";
import {login,sendOTP,signUp} from '../controllers/authentication'
import { isAuthorized } from "../middleware/authorization";
import { resetPassword, resetPasswordToken } from "../controllers/resetPassword";


const CRouter = express.Router();

CRouter.route("/code").post(codeRunner);
CRouter.route("/login").post(login);
CRouter.route("/sendOTP").post(sendOTP);
CRouter.route("/signup").post(signUp);
CRouter.route("/resetpassword-token").post(resetPasswordToken);
CRouter.route("/resetpassword").post(resetPassword);


export {CRouter}