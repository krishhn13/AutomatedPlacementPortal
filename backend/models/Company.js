const mongoose = require("mongoose")

const CompanySchema = new mongoose.Schema({
        name: { 
                type: String,
                required: true
        },
        location: { 
                type: String,
                required: true
        },
        positions: {
                type: [{String:String}],
                required: true
        },
        eligibilityCriteria : {
                type : [String],
                required : true
        }
}, { timestamps: true });

module.exports = mongoose.model("Company", CompanySchema);

