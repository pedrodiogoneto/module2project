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

  // check if user with this username already exists @@to do - validate 
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
  
  User.findOne({ 'username': username }, (err, user) => {
    if (err) {
      return next(err);
    }
  
    if (bcrypt.compareSync(password, user.password)) {
      req.session.currentUser = user;
      res.redirect('/');
    } else {
    
     // res.render('/');
     throw new Error ('error');
    }
  });
})


module.exports = router;
