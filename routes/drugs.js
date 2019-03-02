var express = require("express"),
    router = express.Router(),
    Drug = require("../models/drug"),
    middleware = require("../middleware"),
    requestIp = require('request-ip'),
    xss = require ("xss"),
    xssOptions = require("../xssOptions"),
    myxss = new xss.FilterXSS(xssOptions);


router.get("/", function(req, res){
    Drug.find({}, function(err, allDrugs){
        if(err){
            console.log(err);
        } else {
            res.render("drugs/index", {drugs: allDrugs});
        }
    });
});

router.get("/hepsi", function(req, res){
    Drug.find({}, function(err, allDrugs){
        if(err){
            console.log(err);
        } else {
            res.render("drugs/all", {drugs: allDrugs});
        }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res){
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
        htmlAsText: myxss.process(req.body.htmlAsText)
    }, function(err, newDrug){
        if(err){
            console.log(err);
            res.redirect("/ilaclar");
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
            res.redirect("/ilaclar");
        } else {
            res.render("drugs/show", {drug: foundDrug});
        }
    });
});

router.get("/:drugId/degistir", middleware.isLoggedIn, function(req, res){
    Drug.findById(req.params.drugId, function(err, foundDrug){
        if(err){
            console.log(err);
            res.redirect("/ilaclar");
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
                username: xss(req.user.username),
                ip: requestIp.getClientIp(req)
            },
            beforeEdit: req.body.beforeEdit,
        },
    },
    function(err, updatedDrug){
        if(err){
            res.redirect("/ilaclar");
        } else {
            updatedDrug.name = myxss.process(req.body.name);
            updatedDrug.image = myxss.process(req.body.image);
            updatedDrug.description = myxss.process(req.body.description);
            updatedDrug.htmlCode = myxss.process(req.body.htmlCode);
            updatedDrug.htmlAsText = myxss.process(req.body.htmlAsText);
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