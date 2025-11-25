const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    address: String,
    city: String,
    country: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  images: [String],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amenities: [String],
  hotelType: {
    type: String,
    enum: ['luxury', 'business', 'resort', 'boutique', 'pension'],
    default: 'business'
  },
  rating: {
    type: Number,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'pending'
  },
  tags: [{
    type: String,
    enum: ['신규', '인기', '특가', '추천', '럭셔리', '가족', '비즈니스', '커플', '반려동물', '주말특가']
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.models.Hotel || mongoose.model('Hotel', hotelSchema);
