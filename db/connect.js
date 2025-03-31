const mongoose = require("mongoose");  // Bỏ comment dòng này
const dotenv = require("dotenv");

dotenv.config();  // Load biến môi trường từ .env

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("✅ MongoDB connected!");
    } catch (err) {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1);
    }
};

module.exports = connectDB;
