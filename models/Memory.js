const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const MemorySchema = new Schema({
    title: { type: String, default: '' },
    author: { type: String, default: '' },
    genre: { type: String, default: '' },
    published: { type: String, default: '' },
    pages: { type: String, default: '' },
    started: { type: String, default: '' },
    finished: { type: String, default: '' },
    rating: { type: String, default: '' },
    why: { type: String, default: 'because' },
    words: { type: String, default: 'words' },
    quotes: { type: String, default: 'to be or not to be' },
    moments: { type: String, default: 'that one time when' },
    url: { type: String, default: '' },
    color: { type: String },
    user: { type: String }
});

module.exports = Memory = mongoose.model('memory', MemorySchema)