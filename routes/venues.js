const express = require('express');
const router = express.Router();

const Venues = require('../models/venue');

//render venues list
router.get('/', (req, res, next) => {
    Venues.find({}, (err, venues) => {
      if (err) {
        return next(err);
      }
      res.render('venues/list', {
        title: 'Venues List',
        venues
      });
    });
  });