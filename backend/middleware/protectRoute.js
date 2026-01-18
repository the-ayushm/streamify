import jwt from 'jsonwebtoken'
import User from '../models/user.model.js';

const protectRoute = (req, res, next) => {
    try{
        const token = req.cookies.streamifyToken;
        if(!token){
            return res.status(401).json({
                error: "Not Authorized, no token!"
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = User.findById(decoded.userId).select("-password");

        if(!user){
            return res.status(401).json({
                message: "User not found!"
            })
        }
        req.user = user;
        next();
    }catch(err){
        console.error(err);
        res.status(401).json({
            error: "Invalid or expired token!"
        })
    } 
}

export default protectRoute;