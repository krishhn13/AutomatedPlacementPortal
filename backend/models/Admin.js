const mongoose = require("mongoose")

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    designation: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@chitkara\.edu\.in$/,
        "Admin email must end with @chitkara.edu.in",
      ],
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      default: "admin",
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Admin", adminSchema)
