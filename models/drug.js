var mongoose = require("mongoose");


var drugSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    htmlCode: String,
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
    diseases:[{
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Disease"
        },
        name: String
    }],
    symptoms:[{
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Symptom"
        },
        name: String
    }]
});

module.exports = mongoose.model("Drug", drugSchema);

