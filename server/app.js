// setting up the express backend
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');        // for handling requests to the external API
const cors = require('cors');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');
const session = require('express-session')
const sqlite_store = require('connect-sqlite3')(session)
const db = require('./models/adminModel')


const eventRouters = require('./routes/event.routes')      // for event routes
const adminRouters = require('./routes/auth.routes')

const app = express();

app.use(cors())
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.json())



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


// app.get('/login', (req, res)=>{
//     res.sendFile(__dirname+'/static/loginpage.html')
// })

app.use('/gallery', eventRouters)


//-----------------------------------

app.use(session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    // store: new sqlite_store({db: 'sessions.db', dir: './session_db'})
}));

app.use(passport.initialize())
app.use(passport.session())


app.get('/', (req, res)=>{
    if(req.isAuthenticated()) {
        res.send('<h2> Welcome to WebOverflow! </h2>');
    }
    else res.send('<h3> Login please </h3>')
})


passport.use(new LocalStrategy(function verify(username, password, cb){

    db.findOne({username: username}, (err, admin_data)=>{
        
        if(err) return cb(err);
        if(!admin_data) return cb(null, false, {message: "Invalid user"});
        
        let hashed = crypto.pbkdf2Sync(password, admin_data.salt, 1000, 64, 'sha512').toString('hex')
        
        if(hashed!==admin_data.password) return cb(null, false, { message: 'Incorrect password.' });
        else {
            console.log("successful auth")
            return cb(null, admin_data)
        }
    })
}));


passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
    cb(null, { id: user.id, username: user.username });
    });
});

passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
    return cb(null, user);
    });
});


app.post('/login',
    passport.authenticate('local', {failureRedirect:'/'}), (req, res)=>{
    res.redirect('/admin')
})

app.post('/logout', (req, res)=>{
    req.logout((err)=>{
        if(err) return next(err)
    });
    res.redirect('/')
})



function isAuth(req, res, next){
    if(req.isAuthenticated()) return next()
    else res.redirect('/')
}

app.use('/admin', isAuth, adminRouters);



// error handling middlewares
app.use(function(err, req, res, next){

});