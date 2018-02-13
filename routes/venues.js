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

/* render the create form */
router.get('/new-venue', (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/auth/login', {message: 'Please Login or Signup to Add a new Venue'});
  }
  res.render('venues/new-venue', {
    title: 'Add a new Venue'
  });
});

/* handle the POST from the create form */
router.post('/list', (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/auth/login', {message: 'Please Login or Signup to Add a new Venue'});
  }
  const theVenue = new Venues({
    name: req.body.name,
    archived: false,
    requests: [{
      name: null,
      contact: null,
      description: null
    }],
    owner: req.session.currentUser.username
  });

  theVenue.save((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/venues/list');
  });
});

module.exports = router;
