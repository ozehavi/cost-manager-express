const { uuid } = require('uuidv4');
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const CATEGORIES = ['food', 'health', 'housing', 'sport', 'education', 'transportation', 'other'];
// Connect to the MongoDB database
mongoose.connect('mongodb+srv://ozehavi:Orenz123@cluster0.8pqq64f.mongodb.net/addcost?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log('Error connecting to MongoDB', err));

// Define the cost schema using Mongoose
const costSchema = new mongoose.Schema({
  id: String,
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
      id: uuid(), // generating a unique id
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

module.exports = router;