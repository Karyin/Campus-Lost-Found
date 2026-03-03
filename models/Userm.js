const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Invalid email format'] 
    },
    password: { type: String, required: true },
    role: { type: String, default: 'student' }
});

module.exports = mongoose.model('User', UserSchema);