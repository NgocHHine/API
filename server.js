const express = require('express');
const dotenv = require('dotenv');
// const mongoose = require('mongoose');
const connectDB = require("./db/connect"); 
const cors = require('cors');
require('dotenv').config(); // Import dotenv
// const connectDB = require('./db/connect');
const authRoutes = require('./routes/authRoutes');

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

connectDB();
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
