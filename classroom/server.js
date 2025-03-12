// const express = require("express");
// const app = express();
// // const users = require("./routes/user.js");
// // const posts = require("./routes/post.js");
// const cookieParser = require("cookie-parser");

// app.use(cookieParser("secretcode"));

// app.get("/getsignedcookie",(req,res) => {
//     res.cookie("made-in","India", {signed:true});
//     res.send("Signed cookie send");
// });

// app.get("/verify",(req,res) => {
//     console.log(req.signedCookies);
//     res.send("verified");
// });

// app.get("/getcookies",(req,res) => {
//     res.cookie("greet","hello");
//     res.cookie("Made in","India");
//     res.send("sent You some cookies!");
// })

// app.get("/greet",(req,res) => {
//     let {Name = "anonymous"} = req.cookies;
//     res.send(`Hi ${Name}`);
// })

// app.get("/",(req,res) => {
//     console.dir(req.cookies);
//     res.send("Hi I am root");
// });

// // app.use("/users",users);
// // app.use("/posts",posts);

// app.listen(3000,() => {
//     console.log("Server is listening to 3000");
// })


const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

// app.use(session({secret : "My Super Secret String",resave:false,saveUninitialized:true,}));


const sessionOptions = {
    secret : "My Super Secret String",
    resave : false,
    saveUninitialized:true,
}
app.use(session(sessionOptions)); //Note Session data is not saved in the cookie itself, just the session ID. Session data is stored server-side.
app.use(flash());
app.use((req,res,next) => {
    res.locals.succesMessages = req.flash("success");
    res.locals.failureMessages = req.flash("error");
    next();
})

app.get("/register",(req,res) => {
    let {name = "anonymus"} = req.query;
    req.session.name=name;
    if(name === 'anonymus')
    {
        req.flash("error","User Not Registered");
    }
    else
    {
        req.flash("success",("User Registered Succesfully"));
    }
    // console.log(req.session.name);
    // res.send(name);
    // req.flash("Success","User registered Succesfully");
    res.redirect("/regis");


    // // console.log(name);
    // res.send(`Name is ${name}`)
    // // console.log(res.session.name)
    // res.session.name = name;
    // console.log(res.session.name);

})


app.get("/regis", (req,res) => {
    // console.log(req.flash("Success"));
    // res.render("page.ejs",{ name:req.session.name, MSSG :req.flash("Success")});
    res.locals.succesMessages = req.flash("success");
    res.locals.failureMessages = req.flash("error");
    res.render("page.ejs",{name:req.session.name});
// res.send(`Hello ${req.session.name}`);
// console.log(req.session.name);
});




app.get("/test",(req,res) => {
    console.log("Test");
    res.send("Test succesfull");
})



// app.get("/reqcount",(req,res) => {
//     if(req.session.count) {
//         req.session.count++;
//     }
//     else{
//         req.session.count=1;
//     }

//     res.send(`You sent a request ${req.session.count}`)
// })

app.listen(3000,() => {
    console.log("Server is listening to 3000");
})

