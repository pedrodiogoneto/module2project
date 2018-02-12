const express = require('express');
const router = express.Router();

const Venues = require('../models/venue');

// render venues list
router.get('/list', (req, res, next) => {
  Venues.find({'archived': false}, (err, venues) => {
    if (err) {
      return next(err);
    }
    res.render('venues/list', {
      title: 'Venues List',
      venues
    });
  });
});

module.exports = router;
