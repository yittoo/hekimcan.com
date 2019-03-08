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

router.get("/admin/users", middleware.isOp, function(req, res){
    User.find({"isActivated": false}, function(err, foundUsers){
        if(err){
            console.log(err);
            req.flash("error", "Bilinmeyen bir hata gelişti.");
            res.redirect("/admin");
        } else if(!foundUsers){
            req.flash("info", "Kritere uyan kullanıcı grubu yok.");
            res.redirect("/admin");
        } else {
            res.render("admin/users", {users: foundUsers, active: false});
        }
    });
});

router.get("/admin/users/active", middleware.isOp, function(req, res){
    User.find({"isActivated": true}, function(err, foundUsers){
        if(err){
            console.log(err);
            req.flash("error", "Bilinmeyen bir hata gelişti.");
            res.redirect("/admin");
        } else if(!foundUsers){
            req.flash("info", "Kritere uyan kullanıcı grubu yok.");
            res.redirect("/admin");
        } else {
            res.render("admin/users", {users: foundUsers, active: true});
        };
    });
});

router.get("/admin/users/:userId/promote", middleware.isOp, function(req, res){
    User.findById(req.params.userId, function(err, foundUser){
        if(err){
            console.log(err);
            req.flash("error", "Bilinmeyen bir hata gelişti.");
            res.redirect("/admin");
        } else if(!foundUser){
            req.flash("info", "Kritere uyan kullanıcı yok.")
            res.redirect("back");
        } else {
            if(foundUser.isFrozen){
                req.flash("info", "Bu kullanıcı hesabı dondurulmuş, önce onu kaldırın.");
            } else if(!foundUser.isActivated && !foundUser.isTrustable){
                foundUser.isActivated = true;
                foundUser.save(function(err){
                    if(err){
                        req.flash("error", "Kullanıcı terfisi sırasında bir hata gerçekleşti.")
                        res.redirect("/admin/users")
                    } else {
                        req.flash("success", "Kullanıcı hesabı aktif edildi.");
                        res.redirect("back");
                    }
                });
            } else if(foundUser.isActivated && !foundUser.isTrustable){
                foundUser.isTrustable = true;
                foundUser.save(function(err){
                    if(err){
                        req.flash("error", "Kullanıcı terfisi sırasında bir hata gerçekleşti.")
                        res.redirect("back")
                    } else {
                        req.flash("success", "Kullanıcı hesabı güvenilir ilan edildi.");
                        res.redirect("back");
                    }
                });
            } else {
                req.flash("info", "Bir değişiklik yapılmadı bu kullanıcı zaten aktif ve güvenilir.");
                res.redirect("back");
            };
        };
    });
});

router.get("/admin/users/:userId/freeze", middleware.isOp, function(req, res){
    User.findById(req.params.userId, function(err, foundUser){
        if(err){
            console.log(err);
            req.flash("error", "Bilinmeyen bir hata gelişti.");
            res.redirect("/admin");
        } else if(!foundUser){
            req.flash("info", "Kritere uyan kullanıcı yok.")
            res.redirect("back");
        } else if(foundUser.isOp){
            req.flash("error", "Bu kullanıcı admin, operasyon gerçekleşemez.");
            res.redirect("back");
        } else {
            foundUser.isActivated = false;
            foundUser.isTrustable = false;
            foundUser.isFrozen = true;
            foundUser.save(function(err){
                if(err){
                    req.flash("error", "Kullanıcı dondurulurken bir hata oldu");
                    res.redirect("back");
                } else {
                    req.flash("info", "Kullanıcı başarıyla donduruldu");
                    res.redirect("back");
                };
            });
        };
    });
});

router.get("/admin/users/:userId/unfreeze", middleware.isOp, function(req, res){
    User.findById(req.params.userId, function(err, foundUser){
        if(err){
            console.log(err);
            req.flash("error", "Bilinmeyen bir hata gelişti.");
            res.redirect("/admin");
        } else if(!foundUser){
            req.flash("info", "Kritere uyan kullanıcı yok.")
            res.redirect("/admin/users");
        } else if(!foundUser.isFrozen){
            req.flash("info", "Bu kullanıcı zaten donuk değil bir aksiyon gerçekleşmedi.");
            res.redirect("/admin/users");
        } else if(foundUser.isOp){
            req.flash("error", "Bu kullanıcı admin, operasyon gerçekleşemez.");
            res.redirect("/admin/users");
        } else {
            foundUser.isFrozen = false;
            foundUser.save(function(err){
                if(err){
                    req.flash("error", "Kullanıcı hesap dondurma blockajı kalkarken bir hata oluştu.");
                    res.redirect("/admin/users");
                } else {
                    req.flash("info", "Kullanıcı hesap dondurma blockajı kaldırıldı.");
                    res.redirect("/admin/users");
                };
            });
        };
    });
});

router.get("/admin/users/:userId/sil", middleware.isOp, function(req, res){
    User.findById(req.params.userId, function(err, foundUser){
        if(err){
            req.flash("error", err.message);
            res.redirect("/admin");
        } else if(!foundUser){
            req.flash("info", "Kritere uyan kullanıcı yok.")
            res.redirect("back");
        } else if(foundUser.isOp){
            req.flash("error", "Bu kullanıcı admin, operasyon gerçekleşemez.");
            res.redirect("back");
        } else {
            User.findByIdAndDelete(req.params.userId, function(err){
                if(err){
                    req.flash("error", "Silme işlemi sırasında bir hata gerçekleşti.");
                    res.redirect("/admin/users");
                } else {
                    res.flash("info", "Kullanıcı silindi.");
                    res.redirect("back");
                }
            })
        }
    })
})

router.get("/:typeOf/:id/onayla", middleware.isOp, function(req, res) {
    if(req.params.typeOf === "hastaliklar"){
        var chosenDB = Disease;
    } else if (req.params.typeOf === "haberler"){
        var chosenDB = Article;
    } else if (req.params.typeOf === "ilaclar"){
        var chosenDB = Drug;
    } else {
        req.flash("error", "Seçtiğiniz arama kriteri bulunmamaktadır.");
        res.redirect("back");
    }
    chosenDB.findByIdAndUpdate(req.params.id, {$set: {isActivated: true}},
         function(err, updatedData){
            if(err){
                req.flash("error", "Bir hata oluştu");
                res.redirect("back");
            } else {
                req.flash("success", "Girdi onaylandı");
                res.redirect("back");
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
        res.redirect("back");
    }
    chosenDB.findByIdAndRemove(req.params.id, function(err){
        if(err){
            req.flash("error", "Bir hata oluştu");
            res.redirect("back");
        } else {
            req.flash("info", "Girdi silindi");
            res.redirect("back");
        }
    });
});


module.exports = router;