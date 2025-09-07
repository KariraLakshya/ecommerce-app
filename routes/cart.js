const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Cart = require('../models/Cart');

// @route   GET /api/cart
// @desc    Get user's cart
router.get('/', auth, async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.id }).populate('items.itemId');
        if (!cart) return res.json({ items: [] });
        res.json(cart);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/cart
// @desc    Add/update item in cart
router.post('/', auth, async (req, res) => {
    const { itemId, quantity } = req.body;
    try {
        let cart = await Cart.findOne({ userId: req.user.id });
        if (!cart) {
            cart = new Cart({ userId: req.user.id, items: [{ itemId, quantity }] });
        } else {
            const itemIndex = cart.items.findIndex(p => p.itemId.toString() === itemId);
            if (itemIndex > -1) {
                cart.items[itemIndex].quantity = quantity;
            } else {
                cart.items.push({ itemId, quantity });
            }
        }
        await cart.save();
        const populatedCart = await cart.populate('items.itemId');
        res.json(populatedCart);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/cart/:itemId
// @desc    Remove an item from the cart
router.delete('/:itemId', auth, async (req, res) => {
    try {
        let cart = await Cart.findOne({ userId: req.user.id });
        if (cart) {
            cart.items = cart.items.filter(item => item.itemId.toString() !== req.params.itemId);
            await cart.save();
            const populatedCart = await cart.populate('items.itemId');
            res.json(populatedCart);
        } else {
            res.status(404).json({ msg: 'Cart not found' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;