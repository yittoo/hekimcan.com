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
    timesClicked: Number,
    date: Date,
});

module.exports = mongoose.model("Article", articleSchema);

