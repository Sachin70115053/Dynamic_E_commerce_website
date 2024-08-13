const app=require("./app");
const dotenv=require("dotenv");
const connectDatabase=require("./config/Database");

// handling uncaught error

process.on("uncaughtException",(err)=>{
    console.log('Error:'+ err.message);
    console.log("Shutting down server due to uncaught Exception ");
    process.exit(1);
});

// config

dotenv.config({path:"Backend/config/config.env"});

// connnecting to database
connectDatabase();

const server=app.listen(process.env.PORT,()=>{
    console.log('Server is working on port '+ process.env.PORT)

});
// unhadled Promise Rejection 

process.on("unhandledRejection",(err)=>{
        console.log('Error:'+ err.message);
        console.log("Shutting down server due to unhadled Promise Rejection ");

        server.close(()=>{
            process.exit(1);
        });     
});