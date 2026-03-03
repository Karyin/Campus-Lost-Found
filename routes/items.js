const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Item = require('../models/Item');
const mongoSanitize = require('mongo-sanitize');
const xss = require('xss');

router.get('/', async (req, res) => {
    try {
        const items = await Item.find().sort({ createdAt: -1 });
        res.json(items);
    } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

router.get('/lost', async (req, res) => {
    try {
        const items = await Item.find({ category: 'Lost' }).sort({ createdAt: -1 });
        res.json(items);
    } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

router.get('/found', async (req, res) => {
    try {
        const items = await Item.find({ category: 'Found' }).sort({ createdAt: -1 });
        res.json(items);
    } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

router.get('/my-posts', async (req, res) => {
    try {
        const email = mongoSanitize(req.query.email); 
        if (!email) return res.status(400).json({ error: 'Email parameter is required.' });
        const myItems = await Item.find({ authorEmail: email }).sort({ createdAt: -1 });
        res.json(myItems);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ error: 'Invalid Item ID' });
        const item = await Item.findById(req.params.id);
        if (!item) return res.status(404).json({ error: 'Item not found' });
        res.json(item);
    } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

// post new item
router.post('/', async (req, res) => {
    try {
        const cleanBody = mongoSanitize(req.body);
        cleanBody.title = xss(cleanBody.title);
        if (cleanBody.description) cleanBody.description = xss(cleanBody.description);
        const newItem = new Item(cleanBody);
        await newItem.save();
        res.status(201).json({ message: 'Item posted successfully!' });
    } catch (err) { res.status(400).json({ error: err.message }); }
});

// delete
router.delete('/:id', async (req, res) => {
    try {
        const itemId = mongoSanitize(req.params.id);
        if (!mongoose.Types.ObjectId.isValid(itemId)) return res.status(400).json({ error: 'Invalid ID' });
        const deletedItem = await Item.findByIdAndDelete(itemId);
        if (!deletedItem) return res.status(404).json({ error: 'Item not found' });
        res.json({ message: 'Item deleted successfully' });
    } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

//Modify status
router.patch('/:id/status', async (req, res) => {
    try {
        const itemId = mongoSanitize(req.params.id);
        if (!mongoose.Types.ObjectId.isValid(itemId)) return res.status(400).json({ error: 'Invalid ID' });
        const { status } = mongoSanitize(req.body);
        const updatedItem = await Item.findByIdAndUpdate(itemId, { status: status }, { new: true, runValidators: true });
        if (!updatedItem) return res.status(404).json({ error: 'Item not found' });
        res.json({ message: `Status updated to ${status}` });
    } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

// edit item
router.put('/:id', async (req, res) => {
    try {
        const itemId = mongoSanitize(req.params.id);
        if (!mongoose.Types.ObjectId.isValid(itemId)) return res.status(400).json({ error: 'Invalid ID' });
        const cleanBody = mongoSanitize(req.body);
        if (cleanBody.title) cleanBody.title = xss(cleanBody.title);
        if (cleanBody.description) cleanBody.description = xss(cleanBody.description);
        const updatedItem = await Item.findByIdAndUpdate(itemId, cleanBody, { new: true, runValidators: true });
        if (!updatedItem) return res.status(404).json({ error: 'Item not found' });
        res.json({ message: 'Item updated successfully' });
    } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

module.exports = router;