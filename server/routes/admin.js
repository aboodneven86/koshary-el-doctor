const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');

// Add menu item (admin)
router.post('/menu/add', async (req, res) => {
  try {
    const { name, category, price, description, image } = req.body;
    const newItem = new MenuItem({
      name,
      category,
      price,
      description,
      image
    });
    await newItem.save();
    res.status(201).json({ success: true, item: newItem });
  } catch (error) {
    res.status(500).json({ error: 'خطأ في إضافة المنتج' });
  }
});

// Update menu item
router.put('/menu/update/:id', async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, item });
  } catch (error) {
    res.status(500).json({ error: 'خطأ في تحديث المنتج' });
  }
});

// Delete menu item
router.delete('/menu/delete/:id', async (req, res) => {
  try {
    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'خطأ في حذف المنتج' });
  }
});

module.exports = router;
