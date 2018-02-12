const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const VenueSchema = Schema({
  name: String,
  archived: Boolean,
  requests: [{
    name: String,
    contact: String,
    description: String
  }],
  owner: {
    type: ObjectId,
    ref: 'User'
  }
});

const Venue = mongoose.model('Venue', VenueSchema);

module.exports = Venue;
