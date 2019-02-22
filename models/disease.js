var mongoose = require("mongoose");


var diseaseSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    htmlCode: String,
    editBy: [{
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username: String,
    }],
    author: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username: String
    },
    beforeEdit: [{
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Disease"
        }
    }],
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

