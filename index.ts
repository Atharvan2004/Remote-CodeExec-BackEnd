import express from "express"
import { CRouter } from "./routes/codeRoute";
import cors from "cors";
const app = express();
const port  = 3000;

app.listen(port,()=>{
    console.log(`Server running on port ${port}`)
})
app.use(cors())

app.use(express.json())
app.use(CRouter);

app.get("/",(req:any,res:any)=>{
    res.send("Server is up and running...")
})