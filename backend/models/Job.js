const mongoose = require('mongoose')

const Job = new mongoose.Schema({
        title : {
                type : String,
                required : true
        },
        package : {
                type : String,
                required : true
        },
        internship : {
                type : Boolean,
                required : true
        },
        internshipDuration : {
                type : String,
                required : true
        }
        
})