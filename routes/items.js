const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

// @route   GET /api/items
// @desc    Get all items with optional filtering
router.get('/', async (req, res) => {
    try {
        const { category, minPrice, maxPrice } = req.query;
        let filter = {};
        if (category) filter.category = category;
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }
        const items = await Item.find(filter);
        res.json(items);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/items
// @desc    Add a new item (for setup/admin)
router.post('/', async (req, res) => {
    try {
        const newItem = new Item(req.body);
        const item = await newItem.save();
        res.json(item);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;