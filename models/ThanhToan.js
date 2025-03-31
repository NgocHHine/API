const mongoose = require('mongoose');

const ThanhToanSchema = new mongoose.Schema({
    MaTT: { type: Number, required: true, unique: true },
    Sotien: { type: Number, required: true },
    TrangthaiTT: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    MaLH: { type: String, required: true, ref: 'LichHen' }
});

module.exports = mongoose.model('ThanhToan', ThanhToanSchema);
