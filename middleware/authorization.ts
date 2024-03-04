import jwt from 'jsonwebtoken'

const isAuthorized=async (req:any,res:any,next:any)=>{
    try {
        const token=req.body.token || req.cookies.token ||
        req.header("Authorization").replace("Bearer ","");

        if(!token){
            return res.status(401).json({
                success:false,
                msg:"No token, authorization denied"});
        }

        try {
            const jwt_secret=process.env.JWT_SECRET || '';
            const decode=jwt.verify(token, jwt_secret);
            req.user=decode;
        } catch (error) {
            return res.status(401).json({
                success:false,
                message:"Failed to verify token, authorization denied"
            })
        }

        next();
    } catch (error) {
        return res.status(401).json({
            success:false,
            message:"Something went wrong while verifying token, authorization denied"
        })
    }
}

export {isAuthorized};