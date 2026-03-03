const express = require('express');
const router = express.Router();
const User = require('../models/Userm'); 
const mongoSanitize = require('mongo-sanitize');
const bcrypt = require('bcrypt');

/**
 * @route   POST /api/auth/signup
 * @desc   register new user (Security: Input Validation & Sanitization)
 */
router.post('/signup', async (req, res) => {
    try {
        // 1. Sanitize Input - prevent NoSQL Injection
        const cleanBody = mongoSanitize(req.body);
        const { username, email, password } = cleanBody;

        // 2. Server-side Validation 
        if (!username || username.length < 2) {
            return res.status(400).json({ error: 'Username must be at least 2 characters.' });
        }
        if (!email || !email.endsWith('@qiu.edu.my')) {
            return res.status(400).json({ error: 'Only @qiu.edu.my email addresses are allowed.' });
        }
        if (!password || password.length < 8) {
            return res.status(400).json({ error: 'Security Alert: Password must be at least 8 characters long.' });
        }

        // 3. Database Integrity 
        const exists = await User.findOne({ email: email.toLowerCase() });
        if (exists) {
            return res.status(400).json({ error: 'This email is already registered.' });
        }

        // 4. Password Hashing 
        const hashedPassword = await bcrypt.hash(password, 10);

        // 5. Save User
        const newUser = new User({
            username,
            email: email.toLowerCase(),
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ message: 'User created successfully!' });

    } catch (err) {
        console.error("Signup Error:", err);
        res.status(500).json({ error: 'Database error, please try again.' });
    }
});

/**
 * @route   POST /api/auth/login
 * @desc    user login
 */
router.post('/login', async (req, res) => {
    try {
        const cleanBody = mongoSanitize(req.body);
        const { username, password } = cleanBody; // The username here is actually the email address.

        if (!username || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        // find user
        const user = await User.findOne({ email: username.toLowerCase() });
        if (!user) {
            return res.status(400).json({ error: 'Invalid Email or Password.' });
        }

        // verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid Email or Password.' });
        }

        res.json({ 
            message: 'Login successful', 
            user: { 
                username: user.username, 
                email: user.email 
            } 
        });

    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ error: 'Server error during login.' });
    }
});

/**
 * @route   POST /api/auth/reset-password
 * @desc   Forgot password reset (Security: Manual Reset Logic)
 */
router.post('/reset-password', async (req, res) => {
    try {
        const cleanBody = mongoSanitize(req.body);
        const { email, newPassword } = cleanBody;

        //Basic validation
        if (!email || !newPassword || newPassword.length < 8) {
            return res.status(400).json({ error: 'Valid email and 8-character password required.' });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({ error: 'No account found with this email.' });
        }

        //Encrypt new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        //Update and ensure Database Integrity
        user.password = hashedPassword;
        await user.save();

        res.json({ message: 'Password has been reset successfully!' });

    } catch (err) {
        console.error("Reset Error:", err);
        res.status(500).json({ error: 'Failed to reset password. Please try again.' });
    }
});

module.exports = router;