var middlewareObj = {},
    Article = require("../models/article");



middlewareObj.checkArticleOwnership = function(req, res, next){
    Article.findById(req.params.articleId, function(err, foundArticle){
        if(err){
            res.redirect("/haberler/"+req.params.articleId);
        };
        if(req.user){
            if(foundArticle.author.id.equals(req.user._id) || req.user.isOp){
                return next();
            } else {
                req.flash("error", "Bunun için yetkiniz yok.")
                res.redirect("/haberler/"+req.params.articleId);
            }
        } else {
            req.flash("error", "Bunun için giriş yapmalısınız.")
            res.redirect("/haberler/"+req.params.articleId);
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
    }

}


module.exports = middlewareObj;