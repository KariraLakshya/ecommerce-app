
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const Item = require('./models/Item');
const mongoose = require('mongoose');
require('dotenv').config();
// Initialize App
const app = express();
// Connect to Database
connectDB();
app.use(express.static('public'));
// Middleware
app.use(cors());
app.use(express.json());

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/items', require('./routes/items'));
app.use('/api/cart', require('./routes/cart'));

// Define Port and Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

