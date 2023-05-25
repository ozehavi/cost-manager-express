// Import packages
const express = require("express");
const mongoose = require("mongoose");
const homeRouter = require('./routes/home');
const addCostRouter = require('./routes/addcost');
const reportRouter = require('./routes/report');
const aboutRouter = require('./routes/about');

export const CATEGORIES = ['food', 'health', 'housing', 'sport', 'education', 'transportation', 'other'];

// Middlewares
const app = express();
app.use(express.json());

// Connect to the MongoDB database
mongoose.connect('mongodb+srv://ozehavi:Orenz123@cluster0.8pqq64f.mongodb.net/addcost?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log('Error connecting to MongoDB', err));

// Routes
app.use('/', homeRouter);
app.use('/addcost', addCostRouter);
app.use('/report', reportRouter);
app.use('/about', aboutRouter);


// connection
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening to port ${port}`));
