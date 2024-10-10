const User = require('../models/users');
const jwt = require('jsonwebtoken');

exports.createUser = async(req, res) => {
    try {

        const { username, email, password, role } = req.body;

        const existingUser = await User.findOne({ email });
        if(existingUser) {
            return res.status(400).json({ message: 'User already exist'})
        }

        const newUser = new User({
            username,
            email,
            password,
            role: role || 'registered',
            createdAt: Date.now(),
            savedItems: []
        });

        await newUser.save();

        const token = jwt.sign(
            { id: newUser._id, username: newUser.username, role: newUser.role },
            process.env.JWT_SECRET, // secret key for signing the token
            { expiresIn: '1h' }
        );

        res.status(201).json({ message: 'User created successfully', token, user: newUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        if (password !== user.password) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: user._id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: 'Login successful', token, user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.placeOrder = (req, res) => {
    res.status(200).json({ message: 'Order placed successfully!' });
};