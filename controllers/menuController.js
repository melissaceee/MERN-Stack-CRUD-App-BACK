const menuItem = require("../models/menuItem");


exports.createItem = async (req, res) => {
    try {
        const newMenuItem = new menuItem({
            itemname: req.body.itemname.toLowerCase(), //makes item name lowercase in database
            description: req.body.description,
            price: req.body.price,
            availability: req.body.availability
        });

        await newMenuItem.save();

        res.status(201).json({ message: 'Menu item created successfully', menuItem: newMenuItem });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllItems = async (req, res) => {
    try {
        const items = await menuItem.find(); // retrieve all items
        res.status(200).json(items);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getItemByName = async (req, res) => {
    try {
        const searchTerm = req.params.itemname.replace(/\s+/g, '').toLowerCase();
        const items = await menuItem.find({
            itemname: { $regex: searchTerm, $options: 'i' }  // searches case in-sensitive
        });

        if (!items || items.length === 0) {
            return res.status(404).json({ message: 'No items found' });
        }

        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateItem = async (req, res) => {
    try {
        const itemId = req.params.id;
        const updatedData = req.body;
        const updatedItem = await menuItem.findByIdAndUpdate(
            itemId,              
            updatedData,         
            { new: true } 
        );
        if(!updatedData) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.status(400).json({ message: 'Item updated successfully', item: updatedItem });
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
};



