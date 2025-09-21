const companyModel = require("../models/Company")

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


const updateCompany = async (req, res) => {
        try {
                const { name } = req.params;
                const company = await companyModel.findOne({ name });
                if (!company) {
                        return res.status(404).json({ message: "COMPANY NOT FOUND" });
                }

                if (req.body.name && req.body.name !== name) {
                        const conflict = await companyModel.findOne({ name: req.body.name });
                        if (conflict) return res.status(409).json({ message: "Company already exists" });
                }

                Object.assign(company, req.body);
                const updated = await company.save();
                return res.status(200).json({ data: updated });
        } catch (err) {
                return res.status(500).json({ message: err.message });
        }
}

const deleteCompany = async(req,res)=>{
        try{
                const {name}= req.params;
                const isThere = await companyModel.findOne({name})
                if(!isThere) return res.status(404).json({
                        message : "COMPANY NOT FOUND"
                })
                await companyModel.deleteOne({name});
                return res.status(200).json({message:"Company removed successfully"})
        } catch(err) {
                return res.status(500).json({message:err.message})
        }
}


module.exports = {
        getAll,
        getByName,
        addCompany,
        updateCompany,
        deleteCompany
}
