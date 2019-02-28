var mongoose = require("mongoose");


var symptomSchema = new mongoose.Schema({
    name: String,
    diseases:[
        {
            _id:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Disease"
            },
            name: String,
            likelihood: Number,
        }
    ]
});

module.exports = mongoose.model("Symptom", symptomSchema);