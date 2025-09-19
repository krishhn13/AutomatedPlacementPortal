const express = require('express')
const router = express.Router()
const controller = require('../controllers/adminController')

router.get('/students',controller.getStudents);




module.exports = router;