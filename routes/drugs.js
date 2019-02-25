var express = require("express"),
    router = express.Router(),
    Drug = require("../models/drug"),
    middleware = require("../middleware"),
    requestIp = require('request-ip');


router.get("/", function(req, res){
    Drug.find({}, function(err, allDrugs){
        if(err){
            console.log(err);
        } else {
            res.render("drugs/index", {drugs: allDrugs});
        }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res){
    Drug.create({
        name: req.body.name,
        image: req.body.image,
        description: req.body.description,
        author: {
            id: req.user._id,
            username: req.user.username,
            ip: requestIp.getClientIp(req)
        },
        htmlCode: req.body.htmlCode
    }, function(err, newDrug){
        if(err){
            console.log(err);
            res.redirect("/drugs");
        } else {
            res.redirect("/ilaclar/"+newDrug._id);
        }
    })
});

router.get("/yeni", middleware.isLoggedIn, function(req, res){
    res.render("drugs/new");
});

router.get("/:drugId", function(req, res){
    Drug.findById(req.params.drugId, function(err, foundDrug){
        if(err){
            console.log(err);
            res.redirect("/drugs");
        } else {
            res.render("drugs/show", {drug: foundDrug});
        }
    });
});

router.get("/:drugId/degistir", middleware.isLoggedIn, function(req, res){
    Drug.findById(req.params.drugId, function(err, foundDrug){
        if(err){
            console.log(err);
            res.redirect("/drugs");
        } else {
            res.render("drugs/edit", {drug: foundDrug});
        }
    });
});

router.put("/:drugId", middleware.isLoggedIn, function(req, res){
    Drug.findOneAndUpdate({_id: req.params.drugId},{
        $push: {
            editBy: {
                _id: req.user._id,
                username: req.user.username,
                ip: requestIp.getClientIp(req)
            },
            beforeEdit: req.body.beforeEdit,
        },
    },
    function(err, updatedDrug){
        if(err){
            res.redirect("/ilaclar");
        } else {
            updatedDrug.name = req.body.name;
            updatedDrug.image = req.body.image;
            updatedDrug.description = req.body.description;
            updatedDrug.htmlCode = req.body.htmlCode;
            updatedDrug.save(function(err){
                if(err){
                    res.redirect("/ilaclar");
                } else {
                    res.redirect("/ilaclar/" + req.params.drugId);
                }
            });
        };
    });
});

module.exports = router;