const express=require('express')

const app =express();
const PORT = "8800";
const HOST = '0.0.0.0';

app.use('/',(req,res)=>{
    res.send("Hello world")
})

app.listen(PORT,HOST);
console.log("working backend")