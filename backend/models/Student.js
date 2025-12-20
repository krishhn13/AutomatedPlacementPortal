const mongoose = require("mongoose")

const studentSchema = new mongoose.Schema(
  {
    rollNo: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@chitkara\.edu\.in$/,
        "Email must end with @chitkara.edu.in",
      ],
    },

    password: {
      type: String,
      required: true,
    },

    branch: {
      type: String,
      required: true,
    },

    cgpa: {
      type: Number,
      required: true,
    },

    year: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      default: "",
    },
    
    profilePhoto: {
      filename: String,
      path: String,
      size: Number,
      mimetype: String,
      uploadedAt: Date,
    },

    resume: {
      filename: String,
      path: String,
      size: Number,
      uploadedAt: Date,
    },
    
    location: {
      type: String,
      default: "",
    },

    skills: {
      type: [String],
      default: [],
    },

    backlogs: {
      type: Number,
      default: 0,
    },

    appliedJobs: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Jobs",
      default: [],
    },

    status: {
      type: Map,
      of: String,
      default: {},
    },

    role: {
      type: String,
      default: "student",
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Students", studentSchema)
