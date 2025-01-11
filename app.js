if(process.env.NODE_ENV != 'production'){
    require('dotenv').config(); // env 
    // condittion for ---> when we are in developement phase when we can use this env ,otherwise we cant use this env
};
const express = require("express");
const app = express();
const mongoose = require('mongoose');
const ejs = require('ejs');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const listingRoutes=require('./routes/listings.js');
const reviewRoutes=require('./routes/reviews.js');
const userRoutes=require('./routes/user.js');
const cookieParser = require('cookie-parser');
// -------for Authentication ----------
const passport=require('passport')
const localStratey=require('passport-local');
const User=require('./models/user.js');
// -----------for sessions---------------
const session = require('express-session');
const MongoStore = require('connect-mongo');

// ------------connect-flash----------
const flash = require('connect-flash');



// const mongoDbUrl='mongodb://127.0.0.1:27017/wanderlust'; //using in local machine
const mongoAtlasUrl=process.env.MONGO_CLOUD_URL; //using on cloudly

// --requireing express Error
const expressError = require('./utils/expressError.js');
// ------session storage-----------
const store= MongoStore.create({
    mongoUrl:mongoAtlasUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24 *3600,
});
// --for sessions----
app.use(session({
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    // ------giving time to our cookie--
    cookie:{
        expires:Date.now()+10*24*60*60*1000,
        maxAge:10*24*60*60*1000,
        httpOnly:true,
    }
}));
app.use(cookieParser('secretCode'));

// set path------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
// -------parsing the data
app.use(express.urlencoded({ extended: true }));

// ------for Authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStratey(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// --------flash write after session---
app.use(flash());
app.use((req,res,next)=>{
    res.locals.success=req.flash('success');
    res.locals.updated=req.flash('updated');
    res.locals.error=req.flash('error');
    //  this is for adding style in index page ,when user is logged in then page show logout(button) only ,  
    // if user is not login then index page show signup or login (buttons)
    res.locals.currUser=req.user;  
     // this above line save user details, if user login then give an object, if not then give undifined 
    next();
});
// connecting to database-------------------------------------
main().then((res) => {
    console.log("Connect to Mongo DB");
})
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(mongoAtlasUrl);
};
// ------------------- all listing requets go to this routes---------------
app.use('/listings',listingRoutes);
app.use('/listings/:id/reviews',reviewRoutes);
app.use('/user',userRoutes);

// ------------------------------------------------------------
// ------------------------------------------------------------
// ------------------------------------------------------------
       // aunthentcating user 
    //    app.get('/demouser',async(req,res)=>{
    //         let fakeuser=new User({
    //             email:'vikku@gmail.com',
    //             username:"vikash kumarr4"
    //         });

    //       let demoUser= await User.register(fakeuser,'vik123');
    //       res.send(demoUser);
    //    })
// ------------------------------------------------------------
// ------------------------------------------------------------
// ------------------------------------------------------------

// making requests-------------------------------



// // // when request goes wrong ---------->
app.all("*",(req,res,next)=>{
    next(new expressError(404,"Page Not Found"));
});
// // ---------handling Error-------------
app.use((err, req, res, next) => {
    let { statusCode, message } = err;
    // res.status(statusCode).send(message);
    res.render('Error.ejs', { err });
})
// connecting to server-----------------------------------
const port = 8080;
app.listen(port, () => {
    console.log(`server is runnig at port ${port}`);
});