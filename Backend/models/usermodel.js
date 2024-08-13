const mongoose= require("mongoose");
const validator=require("validator");
const bcryptjs=require("bcryptjs");
const jwt=require("jsonwebtoken");
const crypto=require("crypto");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter your name"],
        maxLength:[30,"name cannot exeed 30 character"],
        minLength:[4,"name cannot be less than 4 character"]
    },
    email:{
        type:String,
        required:[true,"please enter your email"],
        unique:true,
        validator:[validator.isEmail,"please enter valid email"],
    },
    password:{
        type:String,
        required:[true,"please enter your password"],
        minLength:[8,"name cannot be less than 8 character"],
        select:false
    },
    avatar:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },
    role:{
        type:String,
        default:"user"
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
});

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next();
    }
    this.password= await bcryptjs.hash(this.password,10);
});

userSchema.methods.getJWTtoken = function(){
    return jwt.sign({id:this._id},process.env.JWT_Secret,{
        expiresIn : process.env.JWT_Expire,
    });
};

// compare password

userSchema.methods.comparePassword = async function(enteredpassword){
    return await bcryptjs.compare(enteredpassword,this.password);
};

//Generating reset password Token

userSchema.methods.getResetPasswordToken=function(){
    // generating token 
    const resetToken=crypto.randomBytes(20).toString("hex");

    // hashing and adding reset password to the userSchema 

    this.resetPasswordToken=crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetPasswordExpire=Date.now()+15*60*1000;

    return resetToken;
}


module.exports= mongoose.model("user",userSchema);