const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const ObjectId = Schema.Types.ObjectId;
const StringSchema = Schema.Types.String;

const VenueSchema = Schema({
  name: String,
  archived: Boolean,
  requests: [{
    name: String,
    contact: String,
    description: String
  }],
  owner: {
    type: StringSchema,
    ref: 'User'
  },
  about: String,
  location: String,
  size: String
});

const Venue = mongoose.model('Venue', VenueSchema);

module.exports = Venue;
