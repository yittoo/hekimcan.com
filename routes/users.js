var express = require("express"),
    router = express.Router(),
    User = require("../models/user"),
    passport = require("passport"),
    middleware = require("../middleware"),
    requestIp = require('request-ip');

router.get("/register", middleware.isLoggedOut, function(req, res) {
    res.render("user/register");
});

router.post("/register", middleware.isLoggedOut, function(req, res) {
    User.register(new User(
        {
            username: req.body.username,
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            degreeNo: req.body.degreeNo,
            profession: req.body.profession,
            title: req.body.title,
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