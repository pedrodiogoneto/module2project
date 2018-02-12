const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/module2project');

const Venue = require('../models/venue');
const User = require('../models/user');

const venues = [
  {
    name: 'Razzmatazz',
    archived: false,
    requests: [{
      name: 'andre',
      contact: '91876234895',
      description: 'were a band'
    }],
    username: 'Pedro'
  },
  {
    name: 'apollo',
    archived: true,
    requests: [{
      name: 'joao',
      contact: '91876234895',
      description: 'were a folcloric groupº'
    }],
    username: 'Pedro'
  }
];

let promises = venues.map(venue => {
  return User.findOne({username: venue.username})
    .then(user => {
      if (!user) {
        throw new Error(`User "${venue.owner}" was not found!`);
      }
      venue.owner = user._id;
    });
});

Promise.all(promises)
  .then(() => Venue.remove())
  .then(() => Venue.create(venues))
  .then(venues => {
    console.log(`created ${venues.length} venues`);
    mongoose.disconnect();
  });
