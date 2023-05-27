/*
Developers:
Oren Zehavi ID: 315940429
Ilya Yaverbaum ID: 324516673
*/
const mongoose = require('mongoose');

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

module.exports = {
    Cost
}