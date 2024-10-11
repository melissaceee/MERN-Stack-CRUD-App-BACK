const Order = require('../models/order');
const MenuItem = require('../models/menuItem');
const User = require('../models/users');
const mongoose = require('mongoose');

exports.addItemToOrder = async (req, res) => {
    const { menuItemId, quantity, paymentMethod } = req.body;

    try {
        // get the userId from the authenticated user,
        const userId = req.user.id; // gets from JWT

        if (!mongoose.Types.ObjectId.isValid(menuItemId)) {
            return res.status(400).json({ message: 'Invalid menuItemId' });
        }

        const menuItemIdObj = new mongoose.Types.ObjectId(menuItemId);
        const menuItem = await MenuItem.findById(menuItemIdObj);
      
        if (!menuItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }

        // find or create an order for the user
        let order = await Order.findOne({ userid: userId, paymentmethod: paymentMethod });

        if (!order) {
            order = new Order({
                userid: userId,
                items: [],
                totalprice: 0,
                paymentmethod: paymentMethod,
            });
        }

        const existingItem = order.items.find(item => item.menuItem.toString() === menuItemId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            order.items.push({menuItem: menuItemIdObj, quantity});
        }

        // recalculate total price
        let totalPrice = 0;
        for (const item of order.items) {
            const itemDetails = await MenuItem.findById(item.menuItem);
            if (itemDetails) {
                totalPrice += item.quantity * itemDetails.price;
            }
        }
        order.totalprice = totalPrice;

        await order.save();

        res.status(200).json(order);
    } catch (error) {
        console.error("Error adding item to order:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.removeItemFromOrder = async (req, res) => {
    const { menuItemId } = req.query;

    try {
        const userId = req.user.id;

        if (!mongoose.isValidObjectId(menuItemId)) {
            return res.status(400).json({ message: 'Invalid menuItemId' });
        }

        const menuItemIdObj = new mongoose.Types.ObjectId(menuItemId);

        // find the order by userId
        let order = await Order.findOne({ userid: userId });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const itemIndex = order.items.findIndex(item => item.menuItem.toString() === menuItemId);

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Menu item not found in order' });
        }

        // reduce the quantity by 1/remove the item from the order
        if (order.items[itemIndex].quantity > 1) {
            order.items[itemIndex].quantity -= 1;
        } else {
            order.items.splice(itemIndex, 1); // Remove the item from the order
        }

        // recalculate the total price
        if (order.items.length === 0) {
            order.totalprice = 0;
        } else {
            let totalPrice = 0;
            for (const item of order.items) {
                const itemDetails = await MenuItem.findById(item.menuItem);
                if (itemDetails) {
                    totalPrice += item.quantity * itemDetails.price;
                }
            }
            order.totalprice = totalPrice;
        }

        await order.save();

        // update the savedItems in the User schema
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // if the item is no longer in the order, remove it from savedItems
        if (order.items.findIndex(item => item.menuItem.toString() === menuItemId) === -1) {
            user.savedItems = user.savedItems.filter(item => item.toString() !== menuItemIdObj.toString());
        }

        await user.save();

        res.status(200).json({ message: 'Item quantity updated or removed from order and savedItems', order });
    } catch (error) {
        console.error("Error removing item from order:", error);
        res.status(500).json({ message: error.message });
    }
};


exports.getOrder = async (req, res) => {
    try {
        const userId = req.user.id;

        const order = await Order.findOne({ userid: userId }).populate('items.menuItem');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json(order);
    } catch (error) {
        console.error("Error fetching current order:", error);
        res.status(500).json({ message: error.message });
    }
};


