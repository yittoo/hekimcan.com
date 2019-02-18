var express = require("express"),
    app     = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride   = require("method-override"),
    User = require("./models/user.js"),
    middleware = require("./middleware"),
    Disease = require("./models/disease.js");

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

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

//-----Home
app.get("/", function(req, res){
    res.render("index");
});

//-----Diseases
app.get("/hastaliklar/", function(req, res){
    res.render("diseases/index");
});

app.get("/hastaliklar/yeni", function(req, res){
    res.render("diseases/new");
});

app.get("/hastaliklar/:diseaseId", function(req, res){
    res.render("diseases/show", {disease: req.params.diseaseId});
});



//-----Login & Register
app.get("/register", middleware.isLoggedOut, function(req, res) {
    res.render("user/register");
});

app.post("/register", middleware.isLoggedOut, function(req, res) {
    User.register(new User(
        {
            username: req.body.username,
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            degreeNo: req.body.degreeNo,
            profession: req.body.profession,
            title: req.body.title,
        }), req.body.password, 
    function(err, user){
        if(err){
            return res.redirect("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/");
        });
    });
});

app.get("/login", middleware.isLoggedOut, function(req, res) {
    res.render("user/login");
});

app.post("/login",passport.authenticate("local", 
    {
        successRedirect: "/",
        failureRedirect: "/login",
    }),
        function(req, res) {
        
});

app.get("/profil", middleware.isLoggedIn, function(req, res) {
    res.render("user/profile");
});

app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});



app.listen(3000, "127.0.0.1" , function(){
    console.log("medi is a go");
});