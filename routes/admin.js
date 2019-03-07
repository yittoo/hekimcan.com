var express     = require("express"),
    router      = express.Router(),
    middleware  = require("../middleware"),
    User           = require("../models/user.js"),    
    Article        = require("../models/article"),
    Disease        = require("../models/disease"),
    Drug           = require("../models/drug"),
    Symptom        = require("../models/symptom");

router.get("/admin", middleware.isOp, function(req, res) {
    Disease.find({"isActivated": false}, 
    function(err, inactiveDiseases){
        if(err){
            console.log(err);
            req.flash("error", "Bilinmeyen bir hata gerçekleşti.");
            res.redirect("/");
        } else {
            Article.find({"isActivated": false}, 
            function(err, inactiveArticles){
                if(err){
                    console.log(err);
                    req.flash("error", "Bilinmeyen bir hata gerçekleşti.");
                    res.redirect("/");
                } else {
                    Drug.find({"isActivated": false}, 
                    function(err, inactiveDrugs){
                        if(err){
                            console.log(err);
                            req.flash("error", "Bilinmeyen bir hata gerçekleşti.");
                            res.redirect("/");
                        } else {
                            res.render("admin/index", {diseases: inactiveDiseases, drugs: inactiveDrugs, articles: inactiveArticles});
                        }
                    });
                }
            });
        }
    });
});

router.get("/:typeOf/:id/onayla", middleware.isOp, function(req, res) {
    if(req.params.typeOf === "hastaliklar"){
        var chosenDB = Disease;
    } else if (req.params.typeOf === "haberler"){
        var chosenDB = Article;
    } else if (req.params.typeOf === "ilaclar"){
        var chosenDB = Drug;
    } else {
        req.flash("error", "Seçtiğiniz arama kriteri bulunmamaktadır.");
        res.redirect("/admin");
    }
    chosenDB.findByIdAndUpdate(req.params.id, {$set: {isActivated: true}},
         function(err, updatedData){
            if(err){
                req.flash("error", "Bir hata oluştu");
                res.redirect("/admin");
            } else {
                req.flash("success", "Girdi onaylandı");
                res.redirect("/admin");
            }
    })
});

router.get("/:typeOf/:id/sil", middleware.isOp, function(req, res) {
    if(req.params.typeOf === "hastaliklar"){
        var chosenDB = Disease;
    } else if (req.params.typeOf === "haberler"){
        var chosenDB = Article;
    } else if (req.params.typeOf === "ilaclar"){
        var chosenDB = Drug;
    } else {
        req.flash("error", "Seçtiğiniz arama kriteri bulunmamaktadır.");
        res.redirect("/admin");
    }
    chosenDB.findByIdAndRemove(req.params.id, function(err){
            if(err){
                req.flash("error", "Bir hata oluştu");
                res.redirect("/admin");
            } else {
                req.flash("info", "Girdi silindi");
                res.redirect("/admin");
            }
    });
});


module.exports = router;