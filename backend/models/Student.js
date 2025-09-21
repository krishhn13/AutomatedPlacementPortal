const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    rollNo: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    branch: {
        type: String,
        required: true
    },
    cgpa: {
        type: Number,
        required: true
    },
    skills: {
        type: [String],
        default: []
    },
    resume: {
        type: String,
        default: ""
    },
    appliedJobs: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Jobs',
        default: []
    },
    status: {
        type: Map,
        of: String,
        default: {}
    },
    role: {
        type: String,
        default: "student"
    },
    backlogs: {
        type: String,
        default: "0"
    }
}, { timestamps: true });

module.exports = mongoose.model("Students", studentSchema);
