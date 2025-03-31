const mongoose = require('mongoose');

const LichHenSchema = new mongoose.Schema({
    Gia: { type: Number, required: true },
    Diachi: { type: String, required: true },
    Chinhsachbaohiem: { type: String },
    MaLH: { type: String, required: true, unique: true },
    Ngay: { type: Date, required: true },
    Gio: { type: String, required: true },
    TrangthaiLH: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' }
});

module.exports = mongoose.model('LichHen', LichHenSchema);
