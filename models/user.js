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
    isOp: {type: Boolean, default: false},
    isActivated: {type: Boolean, default: false},
    isTrustable: {type: Boolean, default: false},
    isFrozen: {type: Boolean, default: false},
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);