const express = require('express');

const router = express.Router();
const request = require('request');
var s = require('../Startrekconnection.js')
var bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: false }));

router.get('/', (req, res) => {
  res.sendFile('index.html', { root:'public' });
});

router.post('/connection', function (req, res) {
    connection = s.connection(req.body.movie)
    .then(result => res.send("Submitted Successfully!\n" + JSON.stringify(result)))
    .catch(err => res.send("Error!\n" + err));
});

module.exports = router;
