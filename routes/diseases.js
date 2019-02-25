var express = require("express"),
    router = express.Router(),
    Disease = require("../models/disease"),
    middleware = require("../middleware"),
    requestIp = require('request-ip');

router.get("/ara/:id", function(req, res){
    Disease.find({ $text: { $search: req.params.id } }, function(err, foundDiseases){
        if(err){
            console.log(err);
            res.redirect("/");
        } else {
            console.log(foundDiseases);
            res.redirect("/hastaliklar");
        }
    })
})

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
        htmlCode: req.body.htmlCode
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

module.exports = router;