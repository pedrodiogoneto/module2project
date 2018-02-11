const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VenueSchema = Schema({
    name: String,
    owner_id: String,
    archived: Boolean,
    bookingRequests: {
        name: String,
        contact: String,
        Description: String
    }
});

const Venue = mongoose.model('Venue', VenueSchema);
