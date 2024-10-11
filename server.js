const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const router = express.Router();
const cors = require('cors');

const menuRoutes = require('./routes/menuRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to the Express app!');
  });

// Routes go here
app.use('/menu', menuRoutes);
app.use('/user', userRoutes);
app.use('/cart', orderRoutes)


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`The express app is running on port ${PORT}`);
});
