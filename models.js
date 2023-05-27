/*
Developers:
Oren Zehavi ID: 315940429
Ilya Yaverbaum ID: 324516673
*/
const mongoose = require('mongoose');

// Define the user schema using Mongoose
const userSchema = new mongoose.Schema({
    id: Number,
    first_name: String,
    last_name: String,
    birthday: String,
});

// Create a User model based on the user schema
const User = mongoose.model('User', userSchema);

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
    userSchema,
    User,
    costSchema,
    Cost
}