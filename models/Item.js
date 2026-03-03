const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, required: true, maxlength: 1500 },
    category: { type: String, enum: ["Lost", "Found"], required: true, index: true },
    location: { type: String, required: true },
    date: { type: Date, required: true },
    contactInfo: { type: String, required: true },
    authorEmail: { type: String, required: true, index: true },
    imageUrl: { type: String },
    status: { type: String, enum: ["Active", "Resolved"], default: "Active", index: true }
}, { timestamps: true });

module.exports = mongoose.model('Item', ItemSchema);