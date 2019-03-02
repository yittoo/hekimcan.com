var express = require("express"),
    router = express.Router(),
    Disease = require("../models/disease"),
    Symptom = require("../models/symptom"),
    middleware = require("../middleware"),
    requestIp = require('request-ip'),
    xss = require ("xss"),
    xssOptions = require("../xssOptions"),
    myxss = new xss.FilterXSS(xssOptions);



router.get("/", function(req, res){
    Disease.find({}, function(err, allDiseases){
        if(err){
            console.log(err);
            res.redirect("/");
        } else {
            res.render("diseases/index", {diseases: allDiseases});
        }
    });
});

router.get("/hepsi", function(req, res){
    Disease.find({}, function(err, allDiseases){
        if(err){
            console.log(err);
            res.redirect("/");
        } else {
            res.render("diseases/all", {diseases: allDiseases});
        }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res){
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
        symptoms: []
    }, function(err, newDisease){
        if(err){
            console.log(err);
            res.redirect("/hastaliklar");
        } else {
            res.redirect("/hastaliklar/"+newDisease._id);
        }
    })
});

router.get("/yeni", middleware.isLoggedIn, function(req, res){
    res.render("diseases/new");
});

router.get("/:diseaseId", function(req, res){
    Disease.findById(req.params.diseaseId, function(err, foundDisease){
        if(err){
            console.log(err);
            res.redirect("/hastaliklar");
        } else {
            res.render("diseases/show", {disease: foundDisease});
        }
    });
});

router.get("/:diseaseId/degistir", middleware.isLoggedIn, function(req, res){
    Disease.findById(req.params.diseaseId, function(err, foundDisease){
        if(err){
            console.log(err);
            res.redirect("/hastaliklar");
        } else {
            res.render("diseases/edit", {disease: foundDisease});
        }
    });
});

router.put("/:diseaseId", middleware.isLoggedIn, function(req, res){
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
            res.redirect("/hastaliklar");
        } else {
            updatedDisease.name = myxss.process(req.body.name);
            updatedDisease.image = myxss.process(req.body.image);
            updatedDisease.description = myxss.process(req.body.description);
            updatedDisease.htmlCode = myxss.process(req.body.htmlCode);
            updatedDisease.htmlAsText = myxss.process(req.body.htmlAsText);
            updatedDisease.save(function(err){
                if(err){
                    res.redirect("/hastaliklar");
                } else {
                    res.redirect("/hastaliklar/" + req.params.diseaseId);
                }
            });
        }
    });
});

router.put("/:diseaseId/semptomlar", middleware.isLoggedIn, function(req, res){
    Symptom.findOne({name: req.body.name}, function(err, symptom){
        if(err){
            console.log(err);
        } if(!symptom){
            Symptom.create({
                name: xss(req.body.name),
            }, function(err, newSymptom){
                if(err){
                    console.log(err);
                } else {
                    twoWayConnect(req, res, Disease, Symptom, newSymptom);
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
                    if(disease.symptoms.length===0){
                        twoWayConnect(req, res, Disease, Symptom, symptom);
                    } else {
                        for(var i = 0; i < disease.symptoms.length; i++){
                            if(disease.symptoms[i].name === symptom.name){
                                res.redirect("/hastaliklar/"+req.params.diseaseId);
                                break;
                            } else if(i === disease.symptoms.length-1){
                                twoWayConnect(req, res, Disease, Symptom, symptom);
                            }
                        }
                    }
                } else {
                    res.redirect("/hastaliklar/"+req.params.diseaseId);
                }
            });
        };
    });
});



function twoWayConnect(req, res, Disease, Symptom, symptom){
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
                    res.redirect("/hastaliklar/"+req.params.diseaseId);
                } else {
                    res.redirect("/hastaliklar/"+req.params.diseaseId+"#symptom-div");
                }
            })
        }
    })
}

module.exports = router;