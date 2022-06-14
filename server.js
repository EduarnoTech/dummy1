const express=require('express')

const app =express();
const PORT = "8080";
const HOST = '0.0.0.0';

app.use('/',(req,res)=>{
    res.send("Hello world!hare krsna")
})

app.listen(PORT,HOST);
console.log("working backend")