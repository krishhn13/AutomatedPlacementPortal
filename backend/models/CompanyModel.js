const mongoose = require("mongoose")

const CompanySchema = new mongoose.Schema({
        id: {
                type: String,
                required: true,
                unique: true,
                default: () => new mongoose.Types.ObjectId().toHexString(),
                immutable: true
        },
        name: { 
                type: String,
                required: true
        },
        location: { 
                type: String,
                required: true
        },
        positions: {
                type: [String],
                required: true
        },
        salary: {
                type: Number,
                required: true
        }
}, { timestamps: true });

module.exports = mongoose.model("Company", CompanySchema);

