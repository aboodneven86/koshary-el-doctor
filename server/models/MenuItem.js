const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['كشري', 'شيش', 'طاجن', 'دواجن', 'صلصات', 'مشروبات'],
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: String,
  image: String,
  available: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
