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


function isValidDate(year, month, day) {
  if(year > 2050 || year < 1900)
    return false;

  // Create a new Date object using the provided values
  const date = new Date(year, month - 1, day);

  // Check if the Date object's month, day, and year values match the provided values
  // Also, check if the Date object's month value is equal to the provided month minus 1
  // This is because the month parameter in the Date constructor is zero-based (0 - January, 1 - February, etc.)
  return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
  );
}


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