const companyModel = require("../models/CompanyModel")

const getAll = async (req,res) => {
        return companyModel.find();
}

module.exports = {
        getAll
}
