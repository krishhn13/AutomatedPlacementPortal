const companyModel = require("../models/CompanyModel")

const getAll = async (req,res) => {
        try {
                return res.status(200).json({"data": await companyModel.find()});
        } catch(err) {
                res.status(500).json({message:err.message})
        }
}

const addCompany = async(req,res) => {
        try{
                const { name } = req.body;
                if (!name) return res.status(400).json({ message: "Name is required" });

                const existing = await companyModel.findOne({ name });
                if (existing) return res.status(409).json({ message: "Company already exists" });

                const company = new companyModel(req.body);
                const saved = await company.save();
                return res.status(201).json({ data: saved });
        } catch(err) {
                res.status(500).json({message:err.message})
        }
}
const getByName = async (req, res) => {
        try {
                const { name } = req.params;
                const isThere = await companyModel.findOne({ name });
                if (!isThere) return res.status(404).json({ message: "COMPANY NOT FOUND" });
                return res.status(200).json({ data: isThere });
        } catch (err) {
                res.status(500).json({message : err.message});
        } 
}

module.exports = {
        getAll,
        getByName,
        addCompany
}
