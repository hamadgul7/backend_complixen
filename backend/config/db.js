const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        const MONGO_URI = process.env.MONGO_URI;
        console.log('MONGO_URI:', MONGO_URI.replace(/:[^@]+@/, ':****@'));
        const conn = await mongoose.connect(MONGO_URI);
        console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
