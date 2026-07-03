const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  customer: {
    name: String,
    phone: String,
    email: String,
    address: String
  },
  items: [
    {
      name: String,
      price: Number,
      quantity: Number,
      notes: String
    }
  ],
  totalPrice: Number,
  status: {
    type: String,
    enum: ['جديد', 'قيد الإعداد', 'جاهز', 'قيد التوصيل', 'تم التسليم', 'ملغي'],
    default: 'جديد'
  },
  paymentMethod: {
    type: String,
    enum: ['عند الاستلام', 'تحويل بنكي'],
    default: 'عند الاستلام'
  },
  deliveryMethod: {
    type: String,
    enum: ['توصيل', 'استلام من المحل'],
    default: 'استلام من المحل'
  },
  notes: String,
  whatsappSent: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);
