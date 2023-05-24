const express = require('express');
const router = express.Router();

/* GET report page. */
router.get('/', function(req, res, next) {
    const { user_id, year, month } = req.body;

    // Check if any of the parameters are empty
    if (!user_id || !year || !month) {
        return res.status(400).json({ error: 'Missing parameters' });
    }

    const reportJson = {
        food: [{"day":21,"description":"chocolate in ikea","sum":20},{"day":5,"description":"milk","sum":6}],
        health: [],
        housing: [],
        sport: [],
        education: [],
        transportation: [],
        other: []
    };

    // Send the JSON data as the response
    res.status(200).json(reportJson);
});

module.exports = router;
