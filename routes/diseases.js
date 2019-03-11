var express     = require("express"),
    router      = express.Router(),
    Disease     = require("../models/disease"),
    Symptom     = require("../models/symptom"),
    Drug        = require("../models/drug"),
    middleware  = require("../middleware"),
    requestIp   = require('request-ip'),
    xss         = require ("xss"),
    xssOptions  = require("../xssOptions"),
    myxss       = new xss.FilterXSS(xssOptions);



router.get("/", function(req, res){
    Disease.find({}, function(err, allDiseases){
        if(err){
            console.log(err);
            req.flash("error", "Bilinmeyen bir hata gerçekleşti.")
            res.redirect("/");
        } else {
            Disease.findOne({isFeatured: true}, function(err, featuredDisease){
                if(err){
                    console.log(err);
                    req.flash("error", "Bilinmeyen bir hata gerçekleşti.")
                    res.redirect("/");
                } else {
                    res.render("diseases/index", {diseases: allDiseases, featuredDisease: featuredDisease});
                };
            });
        };
    });
});

router.get("/hepsi", function(req, res){
    Disease.find({}, function(err, allDiseases){
        if(err){
            console.log(err);
            req.flash("error", "Bilinmeyen bir hata gerçekleşti.")
            res.redirect("/");
        } else {
            res.render("diseases/all", {diseases: allDiseases});
        }
    });
});

router.post("/", middleware.userIsActivated, function(req, res){
    Disease.create({
        name: myxss.process(req.body.name),
        image: myxss.process(req.body.image),
        description: myxss.process(req.body.description),
        author: {
            id: req.user._id,
            username: req.user.username,
            ip: requestIp.getClientIp(req)
        },
        htmlCode: myxss.process(req.body.htmlCode),
        htmlAsText: myxss.process(req.body.htmlAsText),
        symptoms: [],
        isActivated: middleware.userIsTrustableBool(req, res),
    }, function(err, newDisease){
        if(err){
            console.log(err);
            req.flash("error", "Hastalık kaydı yaratılırken bir hata gerçekleşti")
            res.redirect("/hastaliklar");
        } else {
            req.flash("success", "Hastalık kaydı başarıyla yaratıldı.")
            res.redirect("/hastaliklar/"+newDisease._id);
        }
    })
});

router.get("/yeni", middleware.userIsActivated, function(req, res){
    res.render("diseases/new");
});

router.get("/:diseaseId", function(req, res){
    Disease.findById(req.params.diseaseId, function(err, foundDisease){
        if(err || !foundDisease){
            req.flash("error", "Bu kayıt numarasına sahip hastalık bulunamadı.")
            res.redirect("/hastaliklar");
        } else {
            res.render("diseases/show", {disease: foundDisease});
        }
    });
});

router.get("/:diseaseId/eski/:oldIndex", middleware.checkDiseaseAuthor, function(req, res){
    Disease.findById(req.params.diseaseId, function(err, foundDisease){
        if(err || !foundDisease){
            req.flash("error", "Bu kayıt numarasına sahip hastalık bulunamadı.")
            res.redirect("/hastaliklar");
        } else {
            res.render("diseases/show", {disease: foundDisease, index: req.params.oldIndex});
        };
    });
})

router.get("/:diseaseId/degistir", middleware.checkDiseaseAuthor, function(req, res){
    Disease.findById(req.params.diseaseId, function(err, foundDisease){
        if(err){
            console.log(err);
            req.flash("error", "Bu kayıt numarasına sahip hastalık bulunamadı.");
            res.redirect("/hastaliklar");
        } else {
            res.render("diseases/edit", {disease: foundDisease});
        }
    });
});

router.put("/:diseaseId", middleware.checkDiseaseAuthor, function(req, res){
    Disease.findOneAndUpdate({_id: req.params.diseaseId},{
        $push: {
            editBy: {
                _id: myxss.process(req.user._id),
                username: myxss.process(req.user.username),
                ip: requestIp.getClientIp(req)
            },
            beforeEdit: myxss.process(req.body.beforeEdit),
        },
    },
    function(err, updatedDisease){
        if(err){
            req.flash("error", "Kayıt güncellenirken bilinmeyen bir hata gerçekleşti.")
            res.redirect("/hastaliklar");
        } else {
            updatedDisease.name = myxss.process(req.body.name);
            updatedDisease.image = myxss.process(req.body.image);
            updatedDisease.description = myxss.process(req.body.description);
            updatedDisease.htmlCode = myxss.process(req.body.htmlCode);
            updatedDisease.htmlAsText = myxss.process(req.body.htmlAsText);
            updatedDisease.save(function(err){
                if(err){
                    req.flash("error", "Kayıt güncellenirken bilinmeyen bir hata gerçekleşti.")
                    res.redirect("/hastaliklar");
                } else {
                    req.flash("success", "Kayıt başarıyla güncellendi.")
                    res.redirect("/hastaliklar/" + req.params.diseaseId);
                }
            });
        };
    });
});

router.put("/:diseaseId/semptomlar", middleware.userIsActivated, function(req, res){
    Disease.findById(req.params.diseaseId, function(err, foundDisease){
        if(err || !foundDisease){
            res.redirect("/hastaliklar");
        } else {
            Symptom.findOne({name: req.body.name}, function(err, symptom){
                if(err){
                    console.log(err);
                } if(!symptom){
                    Symptom.create({
                        name: xss(req.body.name),
                    }, function(err, newSymptom){
                        if(err){
                            req.flash("error", "Kayıt güncellenirken bilinmeyen bir hata gerçekleşti.")
                            console.log(err);
                        } else {
                            twoWayConnectWithSymptom(req, res, Disease, Symptom, newSymptom);
                        }
                    })
                } else {
                    Disease.findOne({
                        _id: req.params.diseaseId,
                    }, function(err, disease){
                        if(err){
                            console.log(err);
                            req.flash("error", "Kayıt güncellenirken bilinmeyen bir hata gerçekleşti.")
                            res.redirect("/hastaliklar");
                        } else if(disease){
                            if(disease.symptoms.length===0){
                                twoWayConnectWithSymptom(req, res, Disease, Symptom, symptom);
                            } else {
                                for(var i = 0; i < disease.symptoms.length; i++){
                                    if(disease.symptoms[i].name === symptom.name){
                                        req.flash("error", "Girmek istediğiniz veri zaten mevcut.")
                                        res.redirect("/hastaliklar/"+req.params.diseaseId);
                                        break;
                                    } else if(i === disease.symptoms.length-1){
                                        twoWayConnectWithSymptom(req, res, Disease, Symptom, symptom);
                                    }
                                }
                            }
                        } else {
                            res.redirect("/hastaliklar");
                        }
                    });
                };
            });
        };
    });
});

router.put("/:diseaseId/ilaclar", middleware.userIsActivated, function(req, res){
    Disease.findById(req.params.diseaseId, function(err, foundDisease){
        if(err || !foundDisease){
            res.redirect("/hastaliklar");
        } else {
            Drug.findOne({name: req.body.name}, function(err, drug){
                if(err){
                    console.log(err);
                    res.redirect("/hastaliklar/"+req.params.diseaseId);
                } 
                if(!drug){
                    var emptyDrug = createEmptyDrug();
                    Drug.create({
                        name: xss(req.body.name),
                        htmlAsText: myxss.process(req.body.name),
                        image: emptyDrug.image,
                        description: emptyDrug.description,
                        htmlCode: emptyDrug.htmlCode.replace("İlaç İsmi", req.body.name),
                        author: {
                            id: req.user._id,
                            username: xss(req.user.username),
                            ip: requestIp.getClientIp(req)
                        },
                    }, function(err, newDrug){
                        if(err){
                            req.flash("error", "Kayıt güncellenirken bilinmeyen bir hata gerçekleşti.")
                            console.log(err);
                        } else {
                            twoWayConnectWithDrug(req, res, Disease, Drug, newDrug);
                        }
                    })
                } else {
                    Disease.findOne({
                        _id: req.params.diseaseId,
                    }, function(err, disease){
                        if(err){
                            console.log(err);
                            res.redirect("/hastaliklar");
                        } else if(disease){
                            if(disease.drugs.length === 0){
                                twoWayConnectWithDrug(req, res, Disease, Drug, drug);
                            } else {
                                for(var i = 0; i < disease.drugs.length; i++){
                                    if(disease.drugs[i].name === drug.name){
                                        req.flash("error", "Girmek istediğiniz veri zaten mevcut ve kayıtlı.")
                                        res.redirect("/hastaliklar/"+req.params.diseaseId);
                                        break;
                                    } else if(i === disease.symptoms.length-1){
                                        twoWayConnectWithDrug(req, res, Disease, Drug, drug);
                                    }
                                }
                            }
                        } else {
                            res.redirect("/hastaliklar");
                        };
                    });
                };
            });
        };
    });
});

function twoWayConnectWithDrug(req, res, Disease, Drug, drug){
    Disease.findOneAndUpdate({_id: req.params.diseaseId}, {
        $push: {
            drugs: {
                _id: drug._id,
                name: myxss.process(drug.name),
            }
        }
    }, function(err, updatedDisease){
        if(err){
            console.log(err);
            req.flash("error", "Kayıt güncellenirken bilinmeyen bir hata gerçekleşti.")
            res.redirect("/hastaliklar/"+req.params.diseaseId);
        } else {
            Drug.findOneAndUpdate({_id: drug._id}, {
                $push: {
                    diseases:{
                        _id: updatedDisease._id,
                        name: myxss.process(updatedDisease.name),
                    }
                }
            }, function(err, updatedDrug){
                if(err){
                    console.log(err);
                    req.flash("error", "Kayıt güncellenirken bilinmeyen bir hata gerçekleşti.")
                    res.redirect("/hastaliklar/"+req.params.diseaseId);
                } else {
                    req.flash("success", "Hastalık bilgisine "+ updatedDrug.name +" başarıyla eklendi")
                    res.redirect("/hastaliklar/"+req.params.diseaseId+"#symptom-drug-div");
                };
            });
        };
    });
};



function twoWayConnectWithSymptom(req, res, Disease, Symptom, symptom){
    Disease.findOneAndUpdate({_id: req.params.diseaseId}, {
        $push: {
            symptoms: {
                _id: symptom._id,
                name: myxss.process(symptom.name)
            }
        }
    }, function(err, updatedDisease){
        if(err){
            console.log(err);
            req.flash("error", "Kayıt güncellenirken bilinmeyen bir hata gerçekleşti.")
            res.redirect("/hastaliklar/"+req.params.diseaseId);
        } else {
            Symptom.findOneAndUpdate({_id: symptom._id}, {
                $push: {
                    diseases:{
                        _id: updatedDisease._id,
                        name: myxss.process(updatedDisease.name),
                        likelihood: myxss.process(Math.floor(req.body.likelihood))
                    }
                }
            }, function(err, updatedSymptom){
                if(err){
                    console.log(err);
                    req.flash("error", "Kayıt güncellenirken bilinmeyen bir hata gerçekleşti.")
                    res.redirect("/hastaliklar/"+req.params.diseaseId);
                } else {
                    req.flash("success", "Hastalık bilgisine "+ updatedSymptom.name +" başarıyla eklendi")
                    res.redirect("/hastaliklar/"+req.params.diseaseId+"#symptom-drug-div");
                };
            });
        };
    });
};

function createEmptyDrug(){
    var drug = {
        image: "/img/pills.jpg",
        description: "İlaçla ilgili bilgi daha girilmedi",
        htmlCode: '<div class="twelve wide column"><details open class="details-animated"><summary class="secondary-header">İlaç Hakkında: </summary><p class="details-child">İlaç bilgisi daha eklenmedi </p></details></div><div class="four wide column"><div class="card info-card"><div class="image-div"><img class="ui huge bordered image" alt="kart resim" srcset="/img/germ.jpg"><p>Açıklama </p></div><div class="content"><div class="header" id="data-name"><p>İlaç İsmi </p></div><div class="description"><p class="content-sub-header"><span>Değer </span><span class="content-sub-text">Değer Karşılığı </span></p></div></div></div></div>',
    };
    return drug;
}

module.exports = router;