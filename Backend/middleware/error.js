const Errorhandler=require("..//utils/errorHandler");

module.exports=(err,req,res,next)=>{
    err.statusCode=err.statusCode || 500;
    err.message=err.message || "Internal server Error";

    // wrong mongodb id error
    if(err.name==="CastError"){
        const message='Resource not found. Invalid:'+err.path;
        err = new Errorhandler(message,400);
    }

    // Duplicate mongoose key error
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(message, 400);
    }
    
    // Wrong JWT error
    if (err.name === "JsonWebTokenError") {
        const message = `Json Web Token is invalid, Try again `;
        err = new ErrorHandler(message, 400);
    }
    
    // JWT EXPIRE error
    if (err.name === "TokenExpiredError") {
        const message = `Json Web Token is Expired, Try again `;
        err = new ErrorHandler(message, 400);
    }


    res.status(500).json({
        success:false,
        message:err.message
    });

};