const mongoose=require("mongoose");

const productSchema= mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter the product name "],
        trim:true
    },
    discription:{
        type:String,
        required:[true,"Please enter the product discription "]
    },
    price:{
        type:Number,
        required:[true,"Please enter the product price "],
        maxLength:[8,"price cannot exeed 8 charecter"]
    },
    ratings:{
        type:Number,
        default:0
    },
    Images:[
        {
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }
        }
    ],
    category:{
        type:String,
        required:[true,"please enter product category"]
    },
    stock:{
        type:Number,
        required:[true,"please enter the stock"],
        maxLength:[4,"Stock cannot increase the four charecter"],
        default:1
    },
    numberofreview:{
        type:Number,
        default:0
    },
    reviews:[
        {
            user:{
                type:mongoose.Schema.ObjectId,
                ref:"User",
                required:true,
            },
            name:{
                type:String,
                required:true
            },
            rating:{
                type:Number,
                required:true
            },
            comment:{
                type:String,
                required:true
            }
        },
    ],

    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model("product",productSchema);