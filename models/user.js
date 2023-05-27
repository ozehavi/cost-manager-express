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

module.exports = {
    User
}