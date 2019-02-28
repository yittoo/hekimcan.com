var express = require("express"),
    router = express.Router(),
    Disease = require("../models/disease"),
    Symptom = require("../models/symptom"),
    middleware = require("../middleware"),
    requestIp = require('request-ip');


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
        name: req.body.name,
        image: req.body.image,
        description: req.body.description,
        author: {
            id: req.user._id,
            username: req.user.username,
            ip: requestIp.getClientIp(req)
        },
        htmlCode: req.body.htmlCode,
        htmlAsText: req.body.htmlAsText,
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
                _id: req.user._id,
                username: req.user.username,
                ip: requestIp.getClientIp(req)
            },
            beforeEdit: req.body.beforeEdit,
        },
    },
    function(err, updatedDisease){
        if(err){
            res.redirect("/hastaliklar");
        } else {
            updatedDisease.name = req.body.name;
            updatedDisease.image = req.body.image;
            updatedDisease.description = req.body.description;
            updatedDisease.htmlCode = req.body.htmlCode;
            updatedDisease.htmlAsText = req.body.htmlAsText;
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

router.put("/:diseaseId/semptomlar", function(req, res){
    Symptom.findOne({name: req.body.name}, function(err, symptom){
        if(err){
            console.log(err);
        } if(!symptom){
            Symptom.create({
                name: req.body.name,
            }, function(err, newSymptom){
                if(err){
                    console.log(err);
                } else {
                    console.log(newSymptom);
                    twoWayConnect(req, res, Disease, Symptom, newSymptom);
                }
            })
        } else {
            Disease.findOne({
                _id: req.params.diseaseId,
                symptoms: {name: req.body.name}
            }, function(err, disease){
                if(disease){
                    twoWayConnect(req, res, Disease, Symptom, symptom);
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
                name: symptom.name
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
                        name: updatedDisease.name,
                        likelihood: Math.floor(req.body.likelihood)
                    }
                }
            }, function(err, updatedSymptom){
                if(err){
                    console.log(err);
                    res.redirect("/hastaliklar/"+req.params.diseaseId);
                } else {
                    res.redirect("/hastaliklar/"+req.params.diseaseId+"#new-symptom");
                }
            })
        }
    })
}

module.exports = router;