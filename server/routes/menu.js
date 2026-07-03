const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');

// Get all menu items
router.get('/all', async (req, res) => {
  try {
    const items = await MenuItem.find().sort({ category: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'خطأ في جلب القائمة' });
  }
});

// Get items by category
router.get('/category/:category', async (req, res) => {
  try {
    const items = await MenuItem.find({ category: req.params.category });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'خطأ في جلب الفئة' });
  }
});

module.exports = router;
