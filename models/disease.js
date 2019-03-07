var mongoose = require("mongoose");


var diseaseSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    htmlCode: String,
    htmlAsText: String,
    editBy: [
        {
            _id:{
                type: mongoose.Schema.Types.ObjectId,
                ref:"User",
            },
            username: String,
            ip: String
        }
    ],
    author: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username: String,
        ip: String
    },
    beforeEdit: [String],
    symptoms:[{
        _id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Symptom"
        },
        name: String
    }],
    drugs:[{
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Drug"
        },
        name: String
    }],
    isActivated: {type: Boolean, default: false},
    isFeatured: {type: Boolean, default: false},
});

module.exports = mongoose.model("Disease", diseaseSchema);

