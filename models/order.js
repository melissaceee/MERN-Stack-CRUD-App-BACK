const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true
    },
    items: [
        {
            item: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'menuItem', 
                required: true
            },
            quantity: {
                type: Number, 
                required: true,
                min: 1 
            }
        }
    ],
    totalprice: {
        type: Number,
        required: true,
        min: 0 
    },
    orderdate: {
        type: Date,
        default: Date.now, 
        required: true
    },
    paymentmethod: {
        type: String,
        enum: ['credit card', 'cash'], 
        required: true
    },
    orderId: {
        type: String, 
        unique: true,
        default: function () {
            return `ORD-${Date.now()}`;  //creates a unique id based on date
        }
    }
});

module.exports = mongoose.model('Order', orderSchema);
