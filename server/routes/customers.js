const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');

// Get customer by phone
router.get('/phone/:phone', async (req, res) => {
  try {
    const customer = await Customer.findOne({ phone: req.params.phone })
      .populate('orderHistory');
    if (!customer) {
      return res.status(404).json({ error: 'العميل غير موجود' });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: 'خطأ في جلب بيانات العميل' });
  }
});

// Get all customers (admin)
router.get('/all', async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: 'خطأ في جلب العملاء' });
  }
});

module.exports = router;
