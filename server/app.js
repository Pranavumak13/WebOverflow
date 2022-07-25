// setting up the express backend
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');        // for handling requests to the external API
const cors = require('cors');

const eventRouters = require('./routes/event.routes')      // for event routes

const app = express();

app.use(cors())
app.use(bodyParser.urlencoded({extended: true}))



const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, (err)=>{
    if(err) console.log("Error in connecting to the mongodb: ", err);
    else{
        console.log("Database connection formed");
        app.listen(process.env.PORT, ()=>{
            console.log("Server listening\nClick this link", `http://localhost:${process.env.PORT}`);
        })
    }
})


app.get('/', (req, res)=>{
    res.send('<h2> Welcome to WebOverflow! </h2>');
})


app.use('/gallery', eventRouters)



// error handling middlewares
app.use(function(err, req, res, next){
    
});