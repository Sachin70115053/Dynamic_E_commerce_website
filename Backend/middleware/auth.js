const Errorhandler = require("../utils/errorHandler");
const catchAsyncError = require("./catchAsyncError");
const jwt=require("jsonwebtoken");
const User=require("../models/usermodel");


exports.isAuthenticateUser= catchAsyncError(async(req,res,next)=>{
    const {token} =req.cookies;
    if(!token){
        return next(new Errorhandler("Please login to get access to the resource",401));
    }

    const decodeData=jwt.verify(token,process.env.JWT_Secret);

    req.user= await User.findById(decodeData.id);

    next();
});


exports.authrizeRoles = (...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(
                new Errorhandler(
                    'Role:'+ req.user.role +' is not allowed to access this resource',403
                )
            )
        };
        next();
    }
    
};


