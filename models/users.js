const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        match: /^[a-zA-Z0-9_]+$/,
        minlength: 3,
        maxlength: 30
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: { type: String, required: true },
    
    role: {
        type: String,
        enum: ['guest', 'registered', 'admin'], 
        default: 'guest', 
        required: true
    },
    
    createdAt: { 
      type: Date, 
      default: Date.now 
    },
    
    savedItems: { 
      type: [mongoose.Schema.Types.ObjectId], 
      ref: 'Item'
    }
});

module.exports = mongoose.model('User', userSchema);


