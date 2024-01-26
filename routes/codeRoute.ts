import express from "express"
import {codeRunner}  from "../controllers/codeController";

const CRouter = express.Router();

CRouter.route("/code").post(codeRunner);

export {CRouter}