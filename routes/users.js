var express     = require("express"),
    router      = express.Router(),
    User        = require("../models/user"),
    Article     = require("../models/article"),
    passport    = require("passport"),
    middleware  = require("../middleware"),
    requestIp   = require('request-ip'),
    xss         = require ("xss");

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
            ip: requestIp.getClientIp(req),
        }), req.body.password, 
    function(err, user){
        if(err){
            req.flash("error", "Kayıt başarısız.");
            console.log(err);
            return res.redirect("register");
        }
        req.flash("success", "Kayıt başarılı. Hoşgeldiniz, "+ user.name + " " + user.surname + ". Hesabınız 48 saat içinde girdiğiniz bilgiler doğru ise aktif olacaktır sonrasında siteye gönderi yapabilirsiniz.")
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
        failureFlash: "Yanlış kullanıcı adı ve parola kombinasyonu.",
        successFlash: "Hoşgeldiniz."
    }),
    function(req, res) {

});

router.get("/profil", middleware.isLoggedIn, function(req, res) {
    Article.find({"author.id": req.user._id}, function(err, foundArticles){
        if(err){
            req.flash("error", err.message);
            res.redirect("/");
        } else {
            res.render("user/profile", {user: req.user, articles: foundArticles});
        };
    });
    // res.render("user/profile");
});

router.get("/profil/:userId", function(req, res){
    User.findOne({_id: req.params.userId}, function(err, foundUser){
        if(err || !foundUser){
            req.flash("error", "Bu kayıtta kullanıcı bulunamadı");
            res.redirect("/");
        } else {
            Article.find({"author.id": req.params.userId}, function(err, foundArticles){
                if(err){
                    req.flash("error", err.message);
                    res.redirect("/");
                } else {
                    res.render("user/profile", {user: foundUser, articles: foundArticles});
                };
            });
        };
    });
});

router.get("/profil/:userId/degistir", function(req, res){
    req.flash("info", "Bu kısım daha eklenmedi.");
    res.redirect("/profil");
});

router.get("/logout", function(req, res) {
    if(req.user){
        req.flash("info", "Çıkış başarılı.");
    }
    req.logout();
    res.redirect("/");
});

module.exports = router;