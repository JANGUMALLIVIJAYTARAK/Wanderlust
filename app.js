if(process.env.NODE_ENV != "production") {
  require('dotenv').config();
}

console.log(process.env.SECRET);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const { render } = require("ejs");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

 
const listingRouter = require("./routes/listing.js");
const reviewRouter= require("./routes/review.js");
const userRouter = require("./routes/user.js");


const dbUrl = process.env.ATLASDB_URL

main()
.then((res) => {
    console.log("Conection succesfull");
})
.catch((err) => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")))

const store = MongoStore.create({
  mongoUrl : dbUrl,
  crypto : {
    secret: process.env.SECRET,
  },
  touchAfter : 24*3600,
});

store.on("error",() => {
  console.log("ERROR in MONGO SESSION STORE",err);
})

const sessionOptions = {
  store,
  secret : "My Super Secret String",
  resave : false,
  saveUninitialized:true,
  cookie : {
    expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge : 7 * 24 * 60 * 60 * 1000,
    httpOnly : true,  // Used for the security purpose..cross scripting purpose
  }
};

// app.get("/",(req,res) => {
//   res.send("Hi,I am a rooot");
// });


app.use(session(sessionOptions));
app.use(flash());
 

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
})

// app.get("/demouser", async(req,res) => {
//   let fakeUser = new User({
//     email:"student@gmail.com",
//     username:"delta-student"
//   });

//   let registeredUser = await User.register(fakeUser,"helloworld"); // It automatically check wheather it is unique or not  
//   res.send(registeredUser);
// })

app.use("/listings", listingRouter);


//Reviews....>
 
app.use("/listings/:id/reviews",reviewRouter);

//login and signup
app.use("/",userRouter);

//MIDDELEWARES

app.all("*",(req,res,next) => {
     next(new ExpressError(404,"page not found!"));
});


app.use((err,req,res,next) => {
  let{statusCode=500,message="will not found"} = err;
  //  res.status(statusCode).send(message);
  // res.render("error.ejs",{message});
  res.status(statusCode).render("error.ejs",{message});
}); 


app.listen(9090,() => {
    console.log("Server is listening");
});
