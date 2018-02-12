const express = require('express');
const bcrypt = require('bcrypt');

const User = require('../models/user');

const router = express.Router();

const bcryptSalt = 10;

/* render the signup form. */
router.get('/signup', (req, res, next) => {
  const data = {
    title: 'Signup'
  };

  res.render('auth/signup', data);
});

/* handle the POST from the signup form. */
router.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  // check if user with this username already exists
  User.findOne({ 'username': username }, (err, user) => {
    if (err) {
      return next(err);
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        return next(err);
      }
      res.redirect('/');
    });
  });
});

module.exports = router;
