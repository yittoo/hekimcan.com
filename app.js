var express = require("express"),
    app     = express(),
    bodyParser = require("body-parser");

app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));


//-----Home
app.get("/", function(req, res){
    res.render("index");
});

//-----Diseases
app.get("/hastaliklar/", function(req, res){
    res.render("diseases/index");
});

app.get("/hastaliklar/:diseaseId", function(req, res){
    res.render("diseases/show", {disease: req.params.diseaseId});
});


app.listen(3000, "127.0.0.1" , function(){
    console.log("medi is a go");
});