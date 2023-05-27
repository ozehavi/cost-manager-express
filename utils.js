const mongoose = require('mongoose');

// Define the cost schema using Mongoose
const userSchema = new mongoose.Schema({
    id: Number,
    first_name: String,
    last_name: String,
    birthday: String,
});

// Create a Cost model based on the cost schema
const User = mongoose.model('User', userSchema);

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

// Export the functions to make them accessible from other files
module.exports = {
    isValidDate,
    checkUserExistence
};