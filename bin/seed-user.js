const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/module2project');

const User = require('../models/user');

const p1234encrypted = '1234';

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
