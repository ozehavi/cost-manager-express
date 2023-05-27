/*
Developers:
Oren Zehavi ID: 315940429
Ilya Yaverbaum ID: 324516673
*/
const express = require('express');
const router = express.Router();
const { isValidDate, checkUserExistence } = require('../utils');
const {Cost} = require("../models/cost");

// Validates all params
async function validateParams(user_id, year, month, day, description, category, sum) {
  return [
    !user_id && 'user_id parameter is missing',
    !year && 'year parameter is missing',
    !month && 'month parameter is missing',
    !day && 'day parameter is missing',
    !description && 'description parameter is missing',
    !category && 'category parameter is missing',
    !sum && 'sum parameter is missing',
    !(await checkUserExistence(user_id)) && 'user_id not found',
    !global.categories.includes(category) && `category ${category} is not valid`,
    !isValidDate(year, month, day) && 'date is not valid'
  ].filter(Boolean);
}

function generateNumericUUID() {
  // String containing all possible digits
  const chars = '0123456789';
  let uuid = '';

  // Generate a 22-character UUID
  for (let i = 0; i < 22; i++) {
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

    const newCost = new Cost({
      id: generateNumericUUID(), // generating a unique id
      user_id: user_id,
      year: year,
      month: month,
      day: day,
      description: description,
      category: category,
      sum: sum
    });

    newCost.save();

    // Send the JSON data as the response
    res.status(200).json(newCost);
  } catch (err) {
    // Handle any errors that occur during the retrieval process
    res.status(500).json({error: err});
  }

});

module.exports = router;