const express = require('express');
const router = express.Router();

const Venues = require('../models/venue');

// render venues list
router.get('/', (req, res, next) => {
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
router.post('/', (req, res, next) => {
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
    res.redirect('/venues/');
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
      name: venue.name,
      owner: venue.owner,
      id: venue._id
    };
    res.render('venues/venue-details', data);
  });
});

/* handle the POST from the request booking form */
router.post('/:id', (req, res, next) => {
  const idVenue = req.params.id;
  // if (!req.session.currentUser) {
  //   return res.redirect('/auth/login');
  // }

  Venues.findById(idVenue, (err, venue) => {
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
    const newRequest = {
      name: req.body.name,
      contact: req.body.contact,
      description: req.body.description
    };

    // validate empty request form
    if (newRequest.name === '' || newRequest.contact === '' || newRequest.description === '') {
      // const message = {
      //   message: 'Please fill all the fields!'
      // };
      return res.redirect('/venues/' + idVenue);
    }

    venue.requests.push(newRequest);
    venue.save((err) => {
      if (err) {
        return next(err);
      }

      res.redirect('/venues');
    });
  });
});
module.exports = router;
