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
        id:{
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
    }]
});

module.exports = mongoose.model("Disease", diseaseSchema);

