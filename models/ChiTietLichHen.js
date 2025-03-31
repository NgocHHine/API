const mongoose = require('mongoose');

const ChiTietLichHenSchema = new mongoose.Schema({
    Id: { type: String, required: true, unique: true },
    MaDM: { type: String, required: true, ref: 'DanhMuc' }
});

module.exports = mongoose.model('ChiTietLichHen', ChiTietLichHenSchema);
