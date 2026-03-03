const express = require('express');
const router = express.Router();
const User = require('../models/Userm');
const mongoSanitize = require('mongo-sanitize');
const bcrypt = require('bcrypt');

router.put('/profile', async (req, res) => {
    try {
        const cleanBody = mongoSanitize(req.body);
        const { email, newUsername, newPassword } = cleanBody;
        
        let updateData = { username: newUsername };
        if (newPassword) {
            updateData.password = await bcrypt.hash(newPassword, 10);
        }

        const updatedUser = await User.findOneAndUpdate({ email: email }, updateData, { new: true });
        if (!updatedUser) return res.status(404).json({ error: 'User not found' });
        res.json({ message: 'Profile updated successfully!', user: updatedUser });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;