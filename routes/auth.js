const express = require('express');
const bcrypt = require('bcrypt');

const User = require('../models/user');

const router = express.Router();

const bcryptSalt = 10;

/* render the signup form. */
router.get('/signup', (req, res, next) => {
  if (req.session.currentUser) {
    return res.redirect('/');
  }

  const data = {
    title: 'Signup'
  };
  res.render('auth/signup', data);
});

/* handle the POST from the signup form. */
router.post('/signup', (req, res, next) => {
  if (req.session.currentUser) {
    return res.redirect('/');
  }
  const username = req.body.username;
  const password = req.body.password;

  // validate empty form
  if (username === '' || password === '') {
    console.log('Indicate a username and a password to sign up');
    return res.render('auth/signup');
  }

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
      req.session.currentUser = newUser;
      res.redirect('/');
    });
  });
});

/* render the login form */
router.get('/login', (req, res, next) => {
  if (req.session.currentUser) {
    return res.redirect('/');
  }

  const data = {
    title: 'Login'
  };
  res.render('auth/login', data);
});

/* handle the POST from the login form */
router.post('/login', (req, res, next) => {
  if (req.session.currentUser) {
    return res.redirect('/');
  }
  var username = req.body.username;
  var password = req.body.password;

  if (username === '' || password === '') {
    console.log('Indicate a username and a password to login');
    return res.render('auth/login');
  }

  User.findOne({ 'username': username }, (err, user) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      console.log('not a user!!!');
      return res.render('auth/login');
    }

    if (bcrypt.compareSync(password, user.password)) {
      req.session.currentUser = user;
      res.redirect('/');
    } else {
      res.render('/');
    }
  });
});

/* handle the POST from the logout button. */
router.post('/logout', (req, res, next) => {
  req.session.currentUser = null;
  res.redirect('/');
});

module.exports = router;
