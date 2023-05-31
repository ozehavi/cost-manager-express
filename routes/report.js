/*
Developers:
Oren Zehavi ID: 315940429
Ilya Yaverbaum ID: 324516673
*/
const express = require('express');
const router = express.Router();
const {Cost} = require("../models/cost");
const {checkUserExistence} = require("../utils");
const {CostReport} = require("../models/costReport");

async function validateParams(user_id, year, month) {
    const validYear = year > 1900 && year < 2050;
    const validMonth =  month > 0 && month < 13;
    return [
        !user_id && 'user_id parameter is missing',
        !year && 'year parameter is missing',
        !month && 'month parameter is missing',
        month && !validMonth && 'month is not valid',
        year && !validYear && 'year is not valid',
        user_id && !(await checkUserExistence(user_id)) && 'user_id not found'
    ].filter(Boolean);
}

async function getExistingReport(month, year) {
    //we want to query using those values
    const query = {
        year: year,
        month: month
    };
    return CostReport.find(query);
}

function saveExistingReport(reportJson, month, year){
    try {
        // adding month & year to report Json in order to be able to query by them
        reportJson['month'] = month;
        reportJson['year'] = year;
        const newCostReport = new CostReport(reportJson);

        newCostReport.save()
            .then(() => {
                console.log('Report saved successfully.');
            })
            .catch((error) => {
                console.error('Error saving report:', error.message);
            });
    } catch (error) {
        console.error('Error saving existing report:', error);
    }
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

        const existingReport = await getExistingReport(month, year);
        // if can find an existing report we will return it.
        if(existingReport && existingReport.length > 0) {
            // remove year and month properties from the report as they are using only for query
            delete existingReport['month'];
            delete existingReport['year'];
            // Send the JSON data as the response
            return res.status(200).json(existingReport);
        }

        console.log("Could not find an existing report. Creating a new one...");

        // we want to query using those values
        const query = {
            year: year,
            month: month,
            user_id: user_id
        };

        const costData = await Cost.find(query);

        // create a report json and pre enter all categories arrays
        const report = {};
        global.CATEGORIES.forEach(category => report[category] = []);

        // Iterate over the cost data and populate the categories in the report
        costData.forEach(reportCost => {
            const category = reportCost.category;
            report[category].push({day: reportCost.day, description: reportCost.description, sum: reportCost.sum});
        });

        // if this fails we continue as usual and won't fail the rest of the code.
        saveExistingReport(report, month, year);

        // Send the JSON data as the response
        res.status(200).json(report);

    } catch (error) {
        console.error('Error querying MongoDB:', error);
        res.status(500).json({ error: 'An error occurred while retrieving the cost data.' + error });
    }
});

module.exports = router;