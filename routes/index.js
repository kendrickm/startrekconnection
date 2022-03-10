const express = require('express');

const router = express.Router();
const request = require('request');



router.get('/', (req, res) => {
  res.send('It works!');
  request('https://api.themoviedb.org/3/search/movie?api_key=f67ee0552aacd1674f0b72c90509529d&language=en-US&query=clueless&page=1&include_adult=false', { json: true }, (err, res, body) => {
    if (err) { return console.log(err); }
    console.log(body.url);
    console.log(body.explanation);
  });
});

module.exports = router;
