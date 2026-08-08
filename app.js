require('dotenv').config();




// Workaround: some older dependencies call the deprecated `util.isArray`.
// Replace it with `Array.isArray` early to avoid the deprecation warning.
const _util = require('util');
if (typeof _util.isArray !== 'function' || _util.isArray !== Array.isArray) {
    _util.isArray = Array.isArray;
}

const express = require('express');
const app = express();
const session = require('express-session');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const ejsMate= require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
const listingRouter=require('./routes/listing.js');
const reviewRouter=require('./routes/review.js');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');
const userRouter = require('./routes/user.js');


const MONGO_URL = process.env.ATLASDB_URL;

console.log("Connecting to MongoDB...");

main()
    .then(() => {
        console.log("Connected to MongoDB Atlas");
    })
    .catch((err) => {
        console.error("Database connection failed:");
        console.error(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", [path.join(__dirname, "views"), path.join(__dirname, "classroom", "views")]);
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));



const sessionOptions = {
    name: 'connect.sid',
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 1 week
        httpOnly: true,
        secure: false,
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    }
};

// app.get("/", (req, res) => {
//     res.send("Hii, I am root");
// });


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser()); 

app.use((req,res,next)=>{
    
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currentUser=req.user;
    res.locals.mapToken = process.env.MAP_TOKEN;
    
    next();
});

// app.get("/demouser",async (req,res)=>{
//     let fakeUser=new  User({
//         email: "student@gmail.com",
//         username: "delta-student"
//     });

//     let registeredUser=await User.register(fakeUser, "helloworld");
//     res.send(registeredUser);
// })
app.get("/", (req, res) => {
    res.redirect("/listings");
});

const classroomRouter = require('./classroom/routes/classroom');
app.use('/', classroomRouter);
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/",userRouter);

app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
    let {statusCode = 500, message = "Something went wrong!"} = err;
    res.status(statusCode).render("error.ejs", {message});
    // res.status(statusCode).send(message);
});

module.exports = app;
