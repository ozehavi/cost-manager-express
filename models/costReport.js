/*
Developers:
Oren Zehavi ID: 315940429
Ilya Yaverbaum ID: 324516673
*/
const mongoose = require('mongoose');

// Define the costItemSchema schema using Mongoose
const costItemSchema = new mongoose.Schema({
    day: Number,
    description: String,
    sum: Number
}, { _id: false });

// Define the reportCostSchema schema using Mongoose
const reportCostSchema = new mongoose.Schema({
    month: Number,
    year: Number,
    food: [costItemSchema],
    health: [costItemSchema],
    housing: [costItemSchema],
    sport: [costItemSchema],
    education: [costItemSchema],
    transportation: [costItemSchema],
    other: [costItemSchema]
});

// Create a Cost model based on the cost schema
const CostReport = mongoose.model('CostReport', reportCostSchema);

module.exports = {
    CostReport
}