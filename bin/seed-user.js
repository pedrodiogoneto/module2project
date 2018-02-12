const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
mongoose.connect('mongodb://localhost/module2project');

const User = require('../models/user');

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
const p1234encrypted = bcrypt.hashSync('1234', salt);

let users = [
  {
    username: 'Pedro',
    password: p1234encrypted
  },
  {
    username: 'James',
    password: p1234encrypted
  }
];

User.remove()
  .then(() => User.create(users))
  .then(users => {
    console.log(`created ${users.length} users`);
    mongoose.disconnect();
  });
