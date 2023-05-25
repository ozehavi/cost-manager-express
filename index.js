// Import packages
const express = require("express");
const homeRouter = require('./routes/home');
const addCostRouter = require('./routes/addcost');
const reportRouter = require('./routes/report');
const aboutRouter = require('./routes/about');

// Middlewares
const app = express();
app.use(express.json());

// Routes
app.use('/', homeRouter);
app.use('/addcost', addCostRouter);
app.use('/report', reportRouter);
app.use('/about', aboutRouter);


// connection
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening to port ${port}`));
