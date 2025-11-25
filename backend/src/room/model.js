const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  roomType: {
    type: String,
    enum: ['standard', 'deluxe', 'suite', 'premium'],
    default: 'standard'
  },
  bedType: {
    type: String,
    enum: ['single', 'double', 'twin', 'queen', 'king']
  },
  viewType: {
    type: String,
    enum: ['ocean', 'mountain', 'city', 'garden']
  },
  description: String,
  price: {
    type: Number,
    required: true
  },
  capacity: {
    adults: Number,
    children: Number
  },
  size: Number,
  beds: String,
  images: [String],
  amenities: [String],
  totalRooms: {
    type: Number,
    required: true
  },
  availableRooms: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'unavailable'],
    default: 'available'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.models.Room || mongoose.model('Room', roomSchema);
