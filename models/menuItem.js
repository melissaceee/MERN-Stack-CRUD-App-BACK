const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
    itemname:{ 
        type: String, 
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    availibility: {
        type: Boolean,
        required:true,
        default: true
    }


});

module.exports = mongoose.model('menuItem', menuSchema);