var express = require('express');
var router = express.Router();

router.get('/', async function (req, res) {
    res.status(200).json({ 'message': 'Album of the day API' });
});

module.exports = router;