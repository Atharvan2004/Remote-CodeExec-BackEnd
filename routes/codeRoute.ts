import express from "express"
import {codeRunner}  from "../controllers/codeController";
import rateLimit from "express-rate-limit";

const codeRouter = express.Router();
const codeLimiter=rateLimit({
    windowMs:60 * 60 * 1000,
    limit:100,
    message:"You have used your hourly limit of coding on the Code X. Please, wait for sometime."
  });

codeRouter.post("/coderunner",codeLimiter,codeRunner);

export {codeRouter}