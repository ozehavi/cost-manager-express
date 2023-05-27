const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Define the cost schema using Mongoose
const costSchema = new mongoose.Schema({
  id: Number,
  user_id: Number,
  year: Number,
  month: Number,
  day: Number,
  description: String,
  category: String,
  sum: Number
});

// Create a Cost model based on the cost schema
const Cost = mongoose.model('Cost', costSchema);

// Define the cost schema using Mongoose
const userSchema = new mongoose.Schema({
  id: Number,
  first_name: String,
  last_name: String,
  birthday: String,
});

// Create a Cost model based on the cost schema
const User = mongoose.model('User', userSchema);

// Function to check if user_id exists in the users collection
async function checkUserExistence(user_id) {
  try {
    // Query the users collection to check if the user_id exists
    return await User.exists({ id: user_id });
  } catch (error) {
    console.error(error);
  }
}
// Validates all params
async function validateParams(user_id, year, month, day, description, category, sum) {
  //ToDo: validate year, month
  return [
    !user_id && 'user_id parameter is missing',
    !year && 'year parameter is missing',
    !month && 'month parameter is missing',
    !day && 'day parameter is missing',
    !description && 'description parameter is missing',
    !category && 'category parameter is missing',
    !sum && 'sum parameter is missing',
    !(await checkUserExistence(user_id)) && 'user_id not found',
    !global.categories.includes(category) && `category ${category} is not valid`
  ].filter(Boolean);
}

function generateNumericUUID() {
  // String containing all possible digits
  const chars = '0123456789';
  let uuid = '';

  // Generate a 32-character UUID
  for (let i = 0; i < 32; i++) {
    // Generate a random index to select a digit from the chars string
    const randomNumber = Math.floor(Math.random() * chars.length);
    // Append the selected digit to the UUID
    uuid += chars[randomNumber];
  }

  return uuid;
}


router.post('/', async function (req, res, next) {
  try {
    const {user_id, year, month, day, description, category, sum} = req.body;

    // Check if any of the parameters are empty
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