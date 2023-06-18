/*
Developers:
Oren Zehavi ID: 315940429
Ilya Yaverbaum ID: 324516673
*/
const express = require('express');
const router = express.Router();
const {Cost} = require('../models/cost');
const {checkUserExistence} = require('../utils');
const {CostReport} = require('../models/costReport');
const url = require('url');

async function validateParams(userId, year, month) {
    // validate year and month range
    const validYear = year > 1900 && year < 2050;
    const validMonth =  month > 0 && month < 13;
    // check user id, year and month params existence and validations
    return [
        !userId && 'userId parameter is missing or not a number',
        !year && 'year parameter is missing or not a number',
        !month && 'month parameter is missing or not a number',
        month && !validMonth && 'month is not valid',
        year && !validYear && 'year is not valid',
        userId && !(await checkUserExistence(userId)) && 'userId not found'
    ].filter(Boolean);
}

async function getExistingReport(month, year) {
    //we want to query using those values
    const query = {
        year: year,
        month: month
    };
    // we don't want to return __v, _id, month, year
    return CostReport.find(query, { __v: 0, _id:0, month:0, year:0 });
}

function saveExistingReport(reportJson, month, year){
    try {
        // creating a copy of the report Json
        const report = {...reportJson};
        // adding month & year to report Json in order to be able to query by them
        report['month'] = month;
        report['year'] = year;
        const newCostReport = new CostReport(report);

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

        const queryParameters = url.parse(req.url, true).query;
        // Convert and validate the parameters
        const userId = parseInt(queryParameters.user_id);
        const year = parseInt(queryParameters.year);
        const month = parseInt(queryParameters.month);

        // Check if any of the parameters are not empty and valid
        const errors = await validateParams(userId, year, month);
        if (errors.length > 0) {
            return res.status(400).json({errors: errors.join(' ,')});
        }

        const existingReport = await getExistingReport(month, year);
        // if we can find an existing report we will return it.
        if(existingReport && existingReport.length > 0) {
            // Send the JSON data as the response -getting more than one report is not possible but anyway we get the first one
            return res.status(200).json(existingReport[0]);
        }

        console.log('Could not find an existing report. Creating a new one...');

        // we want to query using those values
        const query = {
            year: year,
            month: month,
            user_id: userId
        };

        const costData = await Cost.find(query, { __v: 0, _id:0, month:0, year:0 });

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