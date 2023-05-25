const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Define the developer schema using Mongoose
const developerSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    id: Number,
    email: String,
});

// Create a Developer model based on the developer schema
const Developer = mongoose.model('Developer', developerSchema);

/* GET about page. */
router.get('/', async function(req, res, next) {
    try {

        // Retrieve all developers from the MongoDB collection
        const developers = await Developer.find();

        // Send the developers as a response
        res.send(developers);
    } catch (err) {
        // Handle any errors that occur during the retrieval process
        res.status(500).send(err);
    }
});

module.exports = router;
