// setting up the express backend
require('dotenv').config();

const express = require('express');

const app = express(); 

app.get('/', (req, res)=>{
    res.send("<h2> Welcome to WebOverflow </h2>");
})


app.listen(process.env.PORT, ()=>{
    console.log("Server listening\nClick this link", `http://localhost:${process.env.PORT}`);
})