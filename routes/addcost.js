const express = require('express');
const router = express.Router();
const CATEGORIES = ['food', 'health', 'housing', 'sport', 'education', 'transportation', 'other'];


/* GET addcost page. */
router.get('/', function(req, res, next) {
  res.render('addcost', { title: 'addcost' });
});

router.post('/', function(req, res, next) {
  const { user_id, year, month, day, description, category, sum } = req.body;

  // Check if any of the parameters are empty
  if (!user_id || !year || !month || !day || !description || !category || !sum) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  //ToDo: need to check if the user_id is found in the users collection

  // Assuming you have the data you want to send as JSON in the following format
  const jsonData = {
    user_id: user_id,
    year: year,
    month: month,
    day: day,
    description: description,
    category: category,
    sum: sum
  };

  // Send the JSON data as the response
  res.status(200).json(jsonData);
});

module.exports = router;