const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const CATEGORIES = ['food', 'health', 'housing', 'sport', 'education', 'transportation', 'other'];

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

router.post('/', function(req, res, next) {
  try {
    const { user_id, year, month, day, description, category, sum } = req.body;

    // Check if any of the parameters are empty
    if (!user_id || !year || !month || !day || !description || !category || !sum) {
      return res.status(400).json({ error: 'Missing parameters' });
    }


    //ToDo: need to check if the user_id is found in the users collection
    //ToDo: validate user_id

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
    res.status(500).json({error:err});
  }

});

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

function validateParams(){
  //ToDo: add all validation here
}


module.exports = router;