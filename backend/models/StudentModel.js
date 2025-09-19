const mongoose = require('mongoose')

const Students = new mongoose.Schema({
        roll : {
                type : Number,
                required : true
        },
        name : {
                type : String,
                required : true,
        },
        CGPA  : {
                type : Number,
                required : true
        },
        backlogs : {
                type : String,
                required : true
        },
        role : {
                type : String,
                required : true
        }

})


module.exports = mongoose.model("Students",Students);