/*
Developers:
Oren Zehavi ID: 315940429
Ilya Yaverbaum ID: 324516673
*/
const express = require('express');
const router = express.Router();
const { isValidDate, checkUserExistence } = require('../utils');
const {Cost} = require("../models/cost");
const {CostReport} = require("../models/costReport");

// Validates all params
async function validateParams(userId, year, month, day, description, category, sum) {
  // converting relevant parameters to number and later validate them
  userId = parseInt(userId);
  year = parseInt(year);
  month = parseInt(month);
  day = parseInt(day);
  sum = parseInt(sum);

  // validating params, will return an array of errors
  return [
    !userId && 'user_id parameter is missing or not a number',
    !year && 'year parameter is missing or not a number',
    !month && 'month parameter is missing or not a number',
    !day && 'day parameter is missing or not a number',
    !description && 'description parameter is missing',
    !category && 'category parameter is missing',
    !sum && 'sum parameter is missing or not a number',
    userId && !(await checkUserExistence(userId)) && 'userId not found',
    category && !global.CATEGORIES.includes(category) && `category ${category} is not valid`,
    day && month && year && !isValidDate(year, month, day) && 'date is not valid',
      sum && typeof sum !== 'number' && 'sum must be a number'
  ].filter(Boolean);
}

function deleteExistingReport(newCost){
  try {
    const query = {
      year: newCost.year,
      month: newCost.month
    };

    // Find and delete documents based on the query (we could use deleteOne but just in case of multiplications)
    CostReport.deleteMany(query)
        .then(() => {
          console.log('cost report deleted successfully.');
        })
        .catch((error) => {
          console.error('Error deleting cost report:', error.message);
        });

  } catch (error) {
    console.error('Error deleting documents:', error);
  }
}

function generateNumericUUID() {
  // String containing all possible digits
  const chars = '0123456789';
  let uuid = '';

  // Generate a 22-character UUID
  for (let i = 0; i < 20; i++) {
    // Generate a random index to select a digit from the chars string
    const randomNumber = Math.floor(Math.random() * chars.length);
    // Append the selected digit to the UUID
    uuid += chars[randomNumber];
  }
  return parseInt(uuid);
}


router.post('/', async function (req, res, next) {
  try {
    const {user_id, year, month, day, description, category, sum} = req.body;

    // Check if any of the parameters are not empty and valid
    const errors = await validateParams(user_id, year, month, day, description, category, sum);
    if (errors.length > 0) {
      return res.status(400).json({errors: errors.join(' ,')});
    }

    let newCost = new Cost({
      id: generateNumericUUID(), // generating a unique id
      user_id: user_id,
      year: year,
      month: month,
      day: day,
      description: description,
      category: category,
      sum: sum
    });

    await newCost.save()
        .then(() => {
          console.log('new cost saved successfully.');
        })
        .catch((error) => {
          console.error('Error saving new cost:', error.message);
        });

    deleteExistingReport(newCost);

    // remove __v and _id from response
    newCost = newCost.toJSON({ versionKey: false, transform: function (doc, ret) {delete ret._id;}});

    // Send the JSON data as the response
    res.status(200).json(newCost);
  } catch (err) {
    // Handle any errors that occur during the retrieval process
    res.status(500).json({error: err});
  }

});

module.exports = router;