const express = require('express');
const router = express.Router();

const Venues = require('../models/venue');

// render venues list
router.get('/', (req, res, next) => {
  Venues.find({'archived': false})
    .populate('owner')
    .exec((err, venues) => {
      if (err) {
        return next(err);
      }
      res.render('venues/list', {
        title: 'Venues List',
        venues
      });
    });
});

// render the create form
router.get('/new-venue', (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/auth/login');
  }
  res.render('venues/new-venue', {
    title: 'Add a new Venue'
  });
});

// handle the POST from the create form
router.post('/', (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/auth/login');
  }
  const theVenue = new Venues({
    name: req.body.name,
    archived: false,
    owner: req.session.currentUser._id,
    about: req.body.about,
    location: req.body.location,
    size: req.body.size
  });

  theVenue.save((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/venues/my-venues');
  });
});

// Render the my-venues page
router.get('/my-venues', (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/auth/login');
  }
  Venues.find({'owner': req.session.currentUser._id}, (err, venues) => {
    if (err) {
      return next(err);
    }
    const data = {
      venues
    };
    res.render('venues/my-venues', data);
  });
});

// Post to the delete button
router.post('/:id/delete-venue', (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/auth/login');
  }
  const id = req.params.id;

  Venues.remove({_id: id}, (err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/venues');
  });
});

// render the detail page
router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  Venues.findById(id)
    .populate('owner')
    .exec((err, venue) => {
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
        venue
      };
      res.render('venues/venue-details', data);
    });
});

// Render the Edit venue form
router.get('/:id/edit-venue', (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/auth/login');
  }
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
      venue
    };
    res.render('venues/edit-venue', data);
  });
});

// Post to the Edit form
router.post('/:id/edit-venue', (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/auth/login');
  }
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
    const editVenue = {
      $set: {
        name: req.body.name,
        about: req.body.about,
        location: req.body.location,
        size: req.body.size
      }
    };

    // validate empty request form
    if (editVenue.name === '') {
      return res.redirect('/venues/' + id);
    }

    Venues.update({_id: id}, editVenue, (err, venue) => {
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
    });
    res.redirect('/venues');
  });
});

/* handle the POST from the request booking form */
router.post('/:id', (req, res, next) => {
  const idVenue = req.params.id;

  // validation only relevant if in the future we add band users aswell
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
