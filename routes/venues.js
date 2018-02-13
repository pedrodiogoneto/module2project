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
    return res.redirect('/auth/login');
  }
  res.render('venues/new-venue', {
    title: 'Add a new Venue'
  });
});

/* handle the POST from the create form */
router.post('/list', (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/auth/login');
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

/* render the detail page */
router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  Venues.findById(id, (err, venue) => {
    if (err) {
      return next(err);
    }
    if (!venue) {
      res.status(404);
      const data = {
        title: '404 Not Found'
      };
      return res.render('not-found', data);
    }
    const data = {
      title: venue.name,
      venue
    };
    res.render('venues/venue-details', data);
  });
});

/* handle the POST from the request booking form */
router.post('/new-booking', (req, res, next) => {
  const id = req.params.id;
  if (!req.session.currentUser) {
    return res.redirect('/auth/login');
  }
  Venues.findById(id, (err, venue) => {
    if (err) {
      return next(err);
    }
    if (!venue) {
      res.status(404);
      const data = {
        title: '404 Not Found'
      };
      return res.render('not-found', data);
    }
    venue.save((err) => {
      if (err) {
        return next(err);
      }
      venue.request.name = req.body.name;
      venue.request.contact = req.body.contact;
      venue.request.description = req.body.description;
      res.redirect('/venues/list');
    });
  });
});
module.exports = router;
