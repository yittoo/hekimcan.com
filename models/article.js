var mongoose = require("mongoose");

var articleSchema = new mongoose.Schema({
    title: String,
    image: String,
    description: String,
    htmlCode: String,
    htmlAsText: String,
    author: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username: String,
        ip: String
    },
    timesClicked: {type: Number, default: 0},
    date: Date,
    isActivated: {type: Boolean, default: false},
    isFeatured: {type: Boolean, default: false},
});

module.exports = mongoose.model("Article", articleSchema);

