const express = require('express');
const Students = require("../models/StudentModel")

const getStudents = async(req , res) => {
        try {
                res.status(200).json({
                        data : Students.find()
                })
        } catch (err) {
                res.status(500).json({
                        message : "Sorry for the inconvenience, server failed abruptly"
                })
        }
}