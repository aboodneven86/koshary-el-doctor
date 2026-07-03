const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Customer = require('../models/Customer');
const { sendWhatsAppMessage } = require('../services/whatsapp');

// Create new order
router.post('/create', async (req, res) => {
  try {
    const { customer, items, totalPrice, deliveryMethod, paymentMethod, notes } = req.body;

    const orderNumber = `ORD-${Date.now()}`;

    const newOrder = new Order({
      orderNumber,
      customer,
      items,
      totalPrice,
      deliveryMethod,
      paymentMethod,
      notes
    });

    await newOrder.save();

    let existingCustomer = await Customer.findOne({ phone: customer.phone });
    if (existingCustomer) {
      existingCustomer.orderHistory.push(newOrder._id);
      existingCustomer.totalSpent += totalPrice;
      existingCustomer.lastOrder = new Date();
      await existingCustomer.save();
    } else {
      const newCustomer = new Customer({
        ...customer,
        orderHistory: [newOrder._id],
        totalSpent: totalPrice,
        lastOrder: new Date()
      });
      await newCustomer.save();
    }

    await sendWhatsAppMessage(newOrder);

    res.status(201).json({
      success: true,
      message: '✅ تم استقبال الطلب بنجاح',
      order: newOrder
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'خطأ في إنشاء الطلب' });
  }
});

// Get order status
router.get('/track/:orderNumber', async (req, res) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber });
    if (!order) {
      return res.status(404).json({ error: 'الطلب غير موجود' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'خطأ في جلب الطلب' });
  }
});

// Get all orders (admin)
router.get('/all', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'خطأ في جلب الطلبات' });
  }
});

// Update order status
router.put('/update/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: new Date() },
      { new: true }
    );

    await sendWhatsAppMessage(order, true);

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ error: 'خطأ في تحديث الطلب' });
  }
});

module.exports = router;
