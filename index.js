// Import packages
const UUID = require('uuid-int')
const express = require("express");
const homeRouter = require('./routes/home');
const addCostRouter = require('./routes/addcost');
const reportRouter = require('./routes/report');
const aboutRouter = require('./routes/about');

const id = 0;

const generator = UUID(id);

const uuid = generator.uuid();
console.log(uuid);

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
