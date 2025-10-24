const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Job' 
},
  student: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' },
  appliedAt: { 
        type: Date, 
        default: Date.now 
},
});

module.exports = mongoose.model('Application', applicationSchema);
