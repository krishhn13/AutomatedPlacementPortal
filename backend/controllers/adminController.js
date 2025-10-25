const Students = require("../models/Student");

const getPlacementReports = async (req, res) => {
    try {
        const totalStudents = await Students.countDocuments();

        const placed = await Students.countDocuments({
            status: { $exists: true, $ne: {} },
            $expr: { $gt: [{
                 $size : {
                    $filter : {
                         input: { 
                            $objectToArray: "$status" 
                        }, cond: {
                             $eq: ["$$this.v", "Selected"] 
                            } } } }, 0] }
        });

        const branchStats = await Students.aggregate([
            {
                $group: {
                    _id: "$branch",
                    total: { $sum: 1 },
                    placed: {
                        $sum: {
                            $size: {
                                $filter: {
                                    input: { $objectToArray: "$status" },
                                    cond: { $eq: ["$$this.v", "Selected"] }
                                }
                            }
                        }
                    }
                }
            }
        ]);

        res.status(200).json({
            totalStudents,
            placed,
            branchStats
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Server failed while generating reports"
        });
    }
};

module.exports = {
    getPlacementReports
};
