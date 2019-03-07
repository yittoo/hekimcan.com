var express = require("express"),
    router = express.Router(),
    Article = require("../models/article"),
    middleware = require("../middleware"),
    requestIp = require('request-ip'),
    xss = require ("xss"),
    xssOptions = require("../xssOptions"),
    myxss = new xss.FilterXSS(xssOptions);

router.get("/", function(req, res){
    res.render("articles/index");
});

router.get("/hepsi", function(req, res){
    res.render("articles/all");
});

router.post("/", middleware.userIsActivated, function(req, res){
    Article.create({
        title: myxss.process(req.body.name),
        image: myxss.process(req.body.image),
        description: myxss.process(req.body.description),
        author: {
            id: req.user._id,
            username: req.user.username,
            ip: requestIp.getClientIp(req)
        },
        htmlCode: myxss.process(req.body.htmlCode),
        htmlAsText: myxss.process(req.body.htmlAsText),
        date: new Date(),
        isActivated: middleware.userIsTrustableBool(req, res),
    }, function(err, newArticle){
        if(err){
            req.flash("error", "Haber girdisi yaratılırken bir hata gerçekleşti")
            console.log(err);
            res.redirect("/haberler");
        } else {
            req.flash("info", "Haberiniz başarıyla yayınlandı.")
            res.redirect("/haberler/"+newArticle._id);
        }
    })
});

router.get("/yeni", middleware.userIsActivated, function(req, res){
    res.render("articles/new");
});

router.get("/:articleId", function(req, res){
    Article.findById(req.params.articleId, function(err, foundArticle){
        if(err || !foundArticle){
            req.flash("error", "Bu kayıt numarasına sahip haber bulunamadı.")
            res.redirect("/haberler");
        } else {
            res.render("articles/show", {article: foundArticle});
        }
    });
});

router.get("/:articleId/degistir", middleware.checkArticleOwnership, function(req, res){
    Article.findById(req.params.articleId, function(err, foundArticle){
        if(err){
            console.log(err);
            res.redirect("/haberler");
        } else {
            res.render("articles/edit", {article: foundArticle});
        }
    });
});

router.put("/:articleId", middleware.checkArticleOwnership, function(req, res){
    Article.findOneAndUpdate({_id: req.params.articleId},{
        title: req.body.name,
        image: req.body.image,
        description: req.body.description,
        htmlCode: req.body.htmlCode,
        htmlAsText: req.body.htmlAsText,
    }, function(err, updatedArticle){
        if(err){
            console.log(err);
            req.flash("error", "Kayıt güncellenirken bilinmeyen bir hata gerçekleşti.")
            res.redirect("/haberler");
        } else {
            req.flash("success", "Kayıt başarıyla güncellendi.");
            res.redirect("/haberler/"+updatedArticle._id);
        }
    })
});

module.exports = router;