/*
Developers:
Oren Zehavi ID: 315940429
Ilya Yaverbaum ID: 324516673
*/
const express = require('express');
const router = express.Router();
const {Cost} = require("../models");
const {checkUserExistence} = require("../utils");

async function validateParams(user_id, year, month) {
    const validYear = year > 1900 && year < 2050;
    const validMonth =  month > 0 && month < 13;
    return [
        !user_id && 'user_id parameter is missing',
        !year && 'year parameter is missing',
        !month && 'month parameter is missing',
        !validMonth && 'month is not valid',
        !validYear && 'year is not valid',
        !(await checkUserExistence(user_id)) && 'user_id not found'
    ].filter(Boolean);
}

/* GET report page. */
router.get('/', async function(req, res, next) {
    try{
        const { user_id, year, month } = req.body;

        // Check if any of the parameters are not empty and valid
        const errors = await validateParams(user_id, year, month);
        if (errors.length > 0) {
            return res.status(400).json({errors: errors.join(' ,')});
        }

        // we want to query using those values
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