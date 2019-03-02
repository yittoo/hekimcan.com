var express = require("express"),
    router = express.Router(),
    User = require("../models/user"),
    passport = require("passport"),
    middleware = require("../middleware"),
    requestIp = require('request-ip'),
    xss = require ("xss");

router.get("/register", middleware.isLoggedOut, function(req, res) {
    res.render("user/register");
});

router.post("/register", middleware.isLoggedOut, function(req, res) {
    User.register(new User(
        {
            username: xss(req.body.username),
            name: xss(req.body.name),
            surname: xss(req.body.surname),
            email: xss(req.body.email),
            degreeNo: xss(req.body.degreeNo),
            profession: xss(req.body.profession),
            title: xss(req.body.title),
            ip: requestIp.getClientIp(req)
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

router.get("/login", middleware.isLoggedOut, function(req, res) {
    res.render("user/login");
});

router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/",
        failureRedirect: "/login",
    }),
        function(req, res) {
        
});

router.get("/profil", middleware.isLoggedIn, function(req, res) {
    res.render("user/profile");
});

router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

module.exports = router;