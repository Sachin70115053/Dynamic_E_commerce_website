const Errorhandler = require("../utils/errorHandler");
const catchAsyncError=require("../middleware/catchAsyncError");
const User=require("../models/usermodel");
const sendToken = require("../utils/jwtToken");
const sendEmail=require("../utils/sendEmail");
const crypto=require("crypto");

// register user

exports.registerUser=catchAsyncError(async(req,res,next)=>{
    const {name,email,password} =req.body;

    const user=await User.create({
        name,
        email,
        password,
        avatar:{
            public_id:"this is sample id",
            url:"this is sample url"
        },
    });

    sendToken(user,201,res);
});


// login user

exports.loginUser = catchAsyncError(async(req,res,next)=>{
    const {email,password}=req.body;
    
    // checking weather user has given both email and password

    if(!email || !password){
        return next(new Errorhandler("Invalid email or password",400));
    }

    const user=await User.findOne({email}).select("+password");

    if(!user){
        return next(new Errorhandler("Invalid email or password",401));
    }

    const isPasswordMatched=user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new Errorhandler("Invalid email or password",401));
    }

    sendToken(user,200,res);
});


// logout user
exports.logoutUser=catchAsyncError(async(req,res,next)=>{

    res.cookie("token",null,{
        expires: new Date(Date.now()),
        httpOnly:true,
    });
    res.status(200).json({
        success:true,
        message:"Logged Out"
    })
});


// Forgot Password


exports.forgotPassword=catchAsyncError(async(req,res,next)=>{

    const user=await User.findOne({email:req.body.email});

    if(!user){
        return next(new Errorhandler("User not fornd",404));
    }

    // get reset password token

    const resetToken=user.getResetPasswordToken();

    await user.save({ validateBeforeSave:false});

    const resetPasswordUrl=`${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;

    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;


    try{
        await sendEmail({
            email:user.email,
            Subject:"Ecommerce Password Recovery",
            message,
        });

        res.status(200).json({
            success:true,
            message:`Email send to ${user.email} successfully`,
        });
    }
    catch(error){
        user.resetPasswordToken=undefined;
        user.resetPasswordExpire=undefined;

        await user.save({ validateBeforeSave:false});

        return next(new Errorhandler(error.message,500));

    }

})


// reset Password

exports.resetPassword = catchAsyncError(async(req,res,next)=>{

    const resetPasswordToken=crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user=await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{ $gt: Date.now()},
    })

    if(!user){
        return next(new Errorhandler("Reset password token is invalid or expired",400));
    }

    if(req.body.password!== req.body.confirmPassword){
        return next(new Errorhandler("Password does not match",400));
    }

    user.password= req.body.password;

    user.resetPasswordToken=undefined;
    user.resetPasswordExpire=undefined;

    await user.save();

    sendToken(user,200,res);

})

// get user profile

exports.getUserProfile= catchAsyncError(async(req,res,next)=>{
    const user=await User.findById(req.user.id);

    res.status(200).json({
        success:true,
        user
    })
})

// update user Password

exports.updatePassword = catchAsyncError(async(req,res,next)=>{
    const user=await User.findById(req.user.id).select("+password");

    const isPasswordMatched= await user.comparePassword(req.body.oldPassword);

    if(!isPasswordMatched){
        return next(new Errorhandler("Password doesn't match",400));
    }

    if(req.body.newPassword!=req.body.confirmPassword){
        return next(new Errorhandler("Entered password are not same",400));
    }

    user.password=req.body.newPassword;

    await user.save();

    sendToken(user,200,res);
});

// update user profile 

exports.updateProfile = catchAsyncError(async(req,res,next)=>{
    const newuserData={
        name:req.body.name,
        email:req.body.email
    };

    // will add cloud later

    const user=await User.findByIdAndUpdate(req.user.id,newuserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });

    res.status(200).json({
        success:true
    });


});


// get all user (admin)

exports.getAllUser=catchAsyncError(async(req,res,next)=>{
    const users=await User.find();

    res.status(200).json({
        success:true,
        users
    });
});

// get single user (admin)

exports.getSingleUser=catchAsyncError(async(req,res,next)=>{

    const user=await User.findById(req.params.id);

    if(!user){
        return next(new Errorhandler(`User does not with id :${req.params.id}`));
    }

    res.status(200).json({
        success:true,
        user
    })
});


// update user role -- admin

exports.updateRole = catchAsyncError(async(req,res,next)=>{
    const newuserData={
        name:req.body.name,
        email:req.body.email,
        role:req.body.role
    };

    const crrUser=await User.findById(req.params.id);

    if(!crrUser){
        return next(new Errorhandler("User Doest not Exist"));
    }

    const user=await User.findByIdAndUpdate(req.params.id,newuserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });

    res.status(200).json({
        success:true
    });
});

//Delete user profile -- Admin

exports.deleteUser = catchAsyncError(async(req,res,next)=>{
    const user=await User.findById(req.params.id);

    if(!user){
        return next(new Errorhandler(`user does not exist with id:${req.params.id}`));
    }


    await User.findByIdAndDelete(req.params.id,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });

    res.status(200).json({
        success:true
    });
});









