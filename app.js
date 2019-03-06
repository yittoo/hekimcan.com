//----- Libraries

var express        = require("express"),
    app            = express(),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    passport       = require("passport"),
    LocalStrategy  = require("passport-local"),
    methodOverride = require("method-override"),
    flash          = require("connect-flash"),

//----- Models

    User           = require("./models/user.js"),    
    Article        = require("./models/article"),
    Disease        = require("./models/disease"),
    Drug           = require("./models/drug"),
    Symptom        = require("./models/symptom"),

//----- Routes
    
    articleRoutes  = require("./routes/articles"),
    diseaseRoutes  = require("./routes/diseases"),
    drugRoutes     = require("./routes/drugs"),
    userRoutes     = require("./routes/users");


app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(flash());

var mongoDbPath = process.env.DATABASEURL ? process.env.DATABASEURL : "mongodb://localhost:27017/doc_web_test";
mongoose.connect(mongoDbPath, { useNewUrlParser: true });


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
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    res.locals.info = req.flash("info");
    Article.find({}, function(err, allArticles){
        if(err){
            console.log("error finding article in middleware");
            console.log(err);
            res.redirect("/");
        } else {
            res.locals.articles = allArticles;
            next();
        }
    });
});

//-----Home

app.get("/", function(req, res){
    res.render("index");
});

//-----Search

app.get("/:typeOfSearch/ara/:searchParameter", function(req, res){
    if(req.params.typeOfSearch === "hastaliklar"){
        var chosenDB = Disease;
    } else if (req.params.typeOfSearch === "semptomlar"){
        var chosenDB = Symptom;
    } else if (req.params.typeOfSearch === "ilaclar"){
        var chosenDB = Drug;
    } else {
        req.flash("error", "Seçtiğiniz arama kriteri bulunmamaktadır.");
        res.redirect("/");
    }
    chosenDB.find({ 
        $text: { 
            $search: req.params.searchParameter, 
            $language: "turkish"}
        }, 
    function(err, foundResults){
        if(err){
            console.log(err);
            req.flash("error", "Bilinmeyen bir hata gerçekleşti.");
            res.redirect("/");
        } else {
            res.render("search", {results: foundResults, typeOfResult: req.params.typeOfSearch});
        }
    });
});

//-----News

app.use("/haberler", articleRoutes);

//-----Diseases

app.use("/hastaliklar", diseaseRoutes);

//-----Drugs

app.use("/ilaclar", drugRoutes);

//-----Login & Register

app.use("", userRoutes);

//-----Listener

var projectPort = process.env.PORT ? process.env.PORT : 3000;
var projectIP = projectPort===3000 ? "127.0.0.1": process.env.IP;

app.listen(projectPort, projectIP , function(){
    console.log("medi is a go");
});

