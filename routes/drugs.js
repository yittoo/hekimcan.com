var express     = require("express"),
    router      = express.Router(),
    Drug        = require("../models/drug"),
    middleware  = require("../middleware"),
    requestIp   = require('request-ip'),
    xss         = require ("xss"),
    xssOptions  = require("../xssOptions"),
    myxss       = new xss.FilterXSS(xssOptions);


router.get("/", function(req, res){
    Drug.find({}, function(err, allDrugs){
        if(err){
            console.log(err);
            req.flash("error", "Bilinmeyen bir hata gerçekleşti.")
        } else {
            Drug.findOne({isFeatured: true}, function(err, featuredDrug){
                if(err){
                    console.log(err);
                    req.flash("error", "Bilinmeyen bir hata gerçekleşti.")
                    res.redirect("/");
                } else {
                    res.render("drugs/index", {drugs: allDrugs, featuredDrug: featuredDrug});
                }
            })
        };
    });
});

router.get("/hepsi", function(req, res){
    Drug.find({}, function(err, allDrugs){
        if(err){
            console.log(err);
            req.flash("error", "Bilinmeyen bir hata gerçekleşti.")
        } else {
            res.render("drugs/all", {drugs: allDrugs});
        }
    });
});

router.post("/", middleware.userIsActivated, function(req, res){
    Drug.create({
        name: myxss.process(req.body.name),
        image: myxss.process(req.body.image),
        description: myxss.process(req.body.description),
        author: {
            id: req.user._id,
            username: xss(req.user.username),
            ip: requestIp.getClientIp(req)
        },
        htmlCode: myxss.process(req.body.htmlCode),
        htmlAsText: myxss.process(req.body.htmlAsText),
        isActivated: middleware.userIsTrustableBool(req, res),
    }, function(err, newDrug){
        if(err){
            console.log(err);
            req.flash("error", "İlaç kaydı yaratılırken bir hata gerçekleşti")
            res.redirect("/ilaclar");
        } else {
            req.flash("success", "İlaç kaydı başarıyla yaratıldı.")
            res.redirect("/ilaclar/"+newDrug._id);
        }
    });
});

router.get("/yeni", middleware.userIsActivated, function(req, res){
    res.render("drugs/new");
});

router.get("/:drugId", function(req, res){
    Drug.findById(req.params.drugId, function(err, foundDrug){
        if(err || !foundDrug){
            req.flash("error", "Bu kayıt numarasına sahip ilaç bulunamadı.")
            res.redirect("/ilaclar");
        } else {
            res.render("drugs/show", {drug: foundDrug});
        }
    });
});

router.get("/:drugId/eski/:oldIndex", middleware.checkDrugAuthor, function(req, res){
    Drug.findById(req.params.drugId, function(err, foundDrug){
        if(err || !foundDrug){
            req.flash("error", "Bu kayıt numarasına sahip ilaç bulunamadı.")
            res.redirect("/ilaclar");
        } else {
            res.render("drugs/show", {drug: foundDrug, index: req.params.oldIndex});
        };
    });
})

router.get("/:drugId/degistir", middleware.checkDrugAuthor, function(req, res){
    Drug.findById(req.params.drugId, function(err, foundDrug){
        if(err){
            console.log(err);
            res.redirect("/ilaclar");
        } else {
            res.render("drugs/edit", {drug: foundDrug});
        }
    });
});

router.put("/:drugId", middleware.checkDrugAuthor, function(req, res){
    Drug.findOneAndUpdate({_id: req.params.drugId},{
        $push: {
            editBy: {
                _id: req.user._id,
                username: xss(req.user.username),
                ip: requestIp.getClientIp(req)
            },
            beforeEdit: req.body.beforeEdit,
        },
    },
    function(err, updatedDrug){
        if(err){
            req.flash("error", "Kayıt güncellenirken bilinmeyen bir hata gerçekleşti.")
            res.redirect("/ilaclar");
        } else {
            updatedDrug.name = myxss.process(req.body.name);
            updatedDrug.image = myxss.process(req.body.image);
            updatedDrug.description = myxss.process(req.body.description);
            updatedDrug.htmlCode = myxss.process(req.body.htmlCode);
            updatedDrug.htmlAsText = myxss.process(req.body.htmlAsText);
            updatedDrug.save(function(err){
                if(err){
                    req.flash("error", "Kayıt güncellenirken bilinmeyen bir hata gerçekleşti.")
                    res.redirect("/ilaclar");
                } else {
                    req.flash("success", "Kayıt başarıyla güncellendi.");
                    res.redirect("/ilaclar/" + req.params.drugId);
                }
            });
        };
    });
});

module.exports = router;