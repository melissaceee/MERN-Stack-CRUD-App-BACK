const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const router = express.Router();
const menuRoutes = require('./routes/menuRoutes');
const userRoutes = require('./routes/userRoutes');


mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to the Express app!');
  });

// Routes go here
app.use('/menu', menuRoutes);
app.use('/user', userRoutes);


app.listen(3000, () => {
  console.log('The express app is ready!');
});
