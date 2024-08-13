const express=require("express");
const erroemiddleware=require("./middleware/error");
const cookieParser=require("cookie-parser");
const app=express();

app.use(express.json());
app.use(cookieParser());


// routes import
const user=require("./routes/userroute")
const product=require("./routes/productroutes");
const order=require("./routes/orderroutes");


app.use("/api/v1",product);
app.use("/api/v1",user);
app.use("/api/v1",order);

// middle ware error

app.use(erroemiddleware);

module.exports=app