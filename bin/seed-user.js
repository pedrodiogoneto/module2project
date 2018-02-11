const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/module2project');

const User = require('../models/user');

const users = [
  {
    username: 'Pedro',
    password: '1234'
  },
  {
    username: 'James',
    password: '1234'
  }
];

User.create(users, (err, savedUsers) => {
  if (err) { throw err; }

  savedUsers.forEach(theuser => {
    console.log(`${theuser.name} - ${theuser._id}`);
  });
  mongoose.disconnect();
});
