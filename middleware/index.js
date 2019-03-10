var middlewareObj = {},
    Article = require("../models/article"),
    Drug = require("../models/drug"),
    Disease = require("../models/disease");

middlewareObj.isOp = function(req, res, next){
    if(req.isAuthenticated() && req.user.isOp){
        return next();
    } else {
        req.flash("error", "Bunun için yetkiniz yok.");
        return res.redirect("/");
    }
}

middlewareObj.userIsActivated = function(req, res, next){
    if(req.isAuthenticated() && req.user.isFrozen){
        req.flash("error", "Hesabınız dondurulmuş bir kullanıcı işlemi yapamazsınız");
        return res.redirect("/");
    }
    if(req.isAuthenticated()){
        if(req.user.isActivated){
            return next();
        } else {
            req.flash("info", "Hesabınız daha yönetici tarafından aktif edilmedi. Girdiğiniz bilgiler doğru ise aktif edilecektir. Lütfen daha sonra tekrar deneyiniz.")
            return res.redirect("back");
        }
    } else {
        req.flash("info", "Bunun için giriş yapmış olmalısınız");
        return res.redirect("/login");
    }
}

middlewareObj.userIsTrustableBool = function(req, res){
    if(req.isAuthenticated() && req.user.isTrustable){
        return true;
    } else {
        return false;
    }
}

middlewareObj.userIsTrustable = function(req, res, next){
    if(req.isAuthenticated() && req.user.isFrozen){
        req.flash("error", "Hesabınız dondurulmuş bir kullanıcı işlemi yapamazsınız");
        return res.redirect("/");
    }
    if(req.isAuthenticated()){
        if(req.user.isActivated){
            if(req.user.isTrustable){
                return next();
            } else {
                req.flash("error", "Bunun için şimdilik yetkiniz yok.");
                return res.redirect("back");
            }
        } else {
            req.flash("info", "Hesabınız daha yönetici tarafından aktif edilmedi. Girdiğiniz bilgiler doğru ise en geç 48 saat içinde aktif edilecektir. Lütfen daha sonra tekrar deneyiniz.")
            return res.redirect("back");
        }
    } else {
        req.flash("error", "Bunun için giriş yapmış olmalısınız");
        return res.redirect("/login");
    }
}

middlewareObj.checkDrugAuthor = function(req, res, next){
    if(req.isAuthenticated() && req.user.isFrozen){
        req.flash("error", "Hesabınız dondurulmuş bir kullanıcı işlemi yapamazsınız");
        return res.redirect("/");
    }
    Drug.findById(req.params.drugId, function(err, foundDrug){
        if(err || !foundDrug){
            return res.redirect("/ilaclar/"+req.params.drugId);
        } else if(req.user){
            if(foundDrug && foundDrug.author.id.equals(req.user._id) || req.user.isOp){
                return next();
            } else {
                return middlewareObj.userIsTrustable(req, res, next);
            }
        } else {
            req.flash("error", "Bunun için giriş yapmalısınız.")
            return res.redirect("/ilaclar/"+req.params.drugId);
        }
    });
};

middlewareObj.checkDiseaseAuthor = function(req, res, next){
    if(req.isAuthenticated() && req.user.isFrozen){
        req.flash("error", "Hesabınız dondurulmuş bir kullanıcı işlemi yapamazsınız");
        return res.redirect("/");
    }
    Disease.findById(req.params.diseaseId, function(err, foundDisease){
        if(err || !foundDisease){
            res.redirect("/hastaliklar");
        } else if(req.user){
            if(foundDisease && foundDisease.author.id.equals(req.user._id) || req.user.isOp){
                return next();
            } else {
                return middlewareObj.userIsTrustable(req, res, next);
            }
        } else {
            req.flash("error", "Bunun için giriş yapmalısınız.")
            return res.redirect("/hastaliklar/"+req.params.diseaseId);
        };
    });
};

middlewareObj.checkArticleOwnership = function(req, res, next){
    if(req.isAuthenticated() && req.user.isFrozen){
        req.flash("error", "Hesabınız dondurulmuş bir kullanıcı işlemi yapamazsınız");
        return res.redirect("/");
    }
    Article.findById(req.params.articleId, function(err, foundArticle){
        if(err || !foundArticle){
            return res.redirect("/haberler");
        } else if(req.user){
            if(foundArticle && foundArticle.author.id.equals(req.user._id) || req.user.isOp){
                return next();
            } else {
                req.flash("error", "Bunun için yetkiniz yok.")
                return res.redirect("/haberler/"+req.params.articleId);
            }
        } else {
            req.flash("error", "Bunun için giriş yapmalısınız.")
            return res.redirect("/haberler/"+req.params.articleId);
        }
    });
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash("error", "Bunun için giriş yapmalısınız.")
        res.redirect("/login");
    }
}

middlewareObj.isLoggedOut = function(req, res, next){
    if(!req.isAuthenticated()){
        return next();
    } else {
        req.flash("error", "Bunun için çıkış yapmalısınız.")
        res.redirect("/");
    };
};

module.exports = middlewareObj;