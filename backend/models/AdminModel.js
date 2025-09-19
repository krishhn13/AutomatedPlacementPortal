const mongoose = require('mongoose');

const Admins = new mongoose.Schema({
        name : {
                type : String,
                required : true
        }, 
        designation : {
                type : String,
                required : true
        }
})

module.exports = mongoose.model("Admin",Admins);