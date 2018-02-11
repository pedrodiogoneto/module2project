const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/module2project');

const Venue = require('../models/venue');

const venues = [
  {
    name: 'Sonora',
    // owner_id: String,
    archived: false,
    bookingRequests: {
      name: null,
      contact: null,
      Description: null
    }
  },
  {
    name: 'Razzmataz',
    // owner_id: String,
    archived: false,
    bookingRequests: {
      name: 'pedro',
      contact: '+351918545232',
      Description: 'my band is fucking great, i want to play'
    }
  }
];

Venue.create(venues, (err, savedVenues) => {
  if (err) { throw err; }

  savedVenues.forEach(thevenue => {
    console.log(`${thevenue.name} - ${thevenue._id}`);
  });
  mongoose.disconnect();
});
