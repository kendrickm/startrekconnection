const express = require('express');

const router = express.Router();
const request = require('request');
var s = require('../Startrekconnection.js')
s.init()
var bodyParser = require("body-parser");
var baseURL = s.baseURL
var image_sizes = s.image_sizes
router.use(bodyParser.urlencoded({ extended: false }));

router.get('/', (req, res) => {
  res.render('index');
});

// router.post('/connection', function (req, res) {
//     connection = s.connection(req.body.movie)
//     .then(result => res.send("Submitted Successfully!\n" + JSON.stringify(result)))
//     .catch(err => res.send("Error!\n" + err));
// });

router.post('/connection', function (req, res) {
    id = s.movieID(req.body.movie)
    .then(result => res.redirect('/connection/' + JSON.stringify(result)))
    // .then(result => res.send("Submitted Successfully!\n" + JSON.stringify(result)))
    .catch(err => res.send("Error!\n" + err));
});

router.get('/connection/:slug', function(req, res) {
  connection = s.connection(req.params.slug)
      .then(result => res.render('connection', {data: result, base_url:s.baseURL, image_size: image_sizes}))
      .catch(err => res.send("Error!\n" + err));
});

module.exports = router;
