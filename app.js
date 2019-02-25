var express = require("express"),
    app     = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride   = require("method-override"),
    User = require("./models/user.js"),
    requestIp = require('request-ip'),
    diseaseRoutes   = require("./routes/diseases"),
    drugRoutes = require("./routes/drugs"),
    userRoutes = require("./routes/users");

app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

mongoose.connect("mongodb://localhost:27017/doc_web_test", { useNewUrlParser: true });

app.use(require("express-session")({
    secret: "f7a9apfmbn47dshtejakg3ghflpqwkfd",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const ipMiddleware = function(req, res, next) {
    const clientIp = requestIp.getClientIp(req);
    console.log(clientIp)
    next();
};

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

//-----Home

app.get("/", function(req, res){
    res.render("index");
});

//-----Diseases

app.use("/hastaliklar", diseaseRoutes);

//-----Drugs

app.use("/ilaclar", drugRoutes);

//-----Login & Register

app.use("", userRoutes);

//-----Listener

app.listen(3000, "127.0.0.1" , function(){
    console.log("medi is a go");
});

