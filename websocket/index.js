//require

// const express = require("express");
let express= require("express");
let socket = require("socket.io");


// app start here
let app = express();


//server setup
let server = app.listen(5000,()=>{
    console.log("project is running on local host 5000.");
});


// route setup
app.get("/",(res,req)=>{
    req.sendFile(__dirname+'/public/index.html');
});


// socket setup
let io = socket(server);
io.on("connection",(socket)=>{
    console.log("Socket connection connected" + " " + socket.id);
});