const express = require('express');
const router = express.Router();
const {Cost} = require("../models");

function validateParams(user_id, year, month){
    //ToDo: validate year, month
    //ToDo: validate user_id
}

/* GET report page. */
router.get('/', async function(req, res, next) {
    try{
        const { user_id, year, month } = req.body;

        // Check if any of the parameters are empty
        if (!user_id || !year || !month) {
            return res.status(400).json({ error: 'Missing parameters' });
        }

        const query = {
            year: year,
            month: month,
            user_id: user_id
        };

        const costData = await Cost.find(query);

        // create a report json and pre enters all categories arrays
        const report = {};
        global.categories.forEach(category => report[category] = []);

        // Iterate over the cost data and populate the categories in the report
        costData.forEach(reportCost => {
            const category = reportCost.category;
            report[category].push({day: reportCost.day, description: reportCost.description, sum: reportCost.sum});
        });

        // Send the JSON data as the response
        res.status(200).json(report);

    } catch (error) {
        console.error('Error querying MongoDB:', error);
        res.status(500).json({ error: 'An error occurred while retrieving the cost data.' + error });
    }
});

module.exports = router;
