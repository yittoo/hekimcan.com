var mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    username: String,
    name: String,
    surname: String,
    password: String,
    email: String,
    degreeNo: String,
    profession: String,
    title: String,
    ip: String,
    isOp: Boolean,
});

userSchema.plugin(passportLocalMongoose);

module.exports= mongoose.model("User", userSchema);