const mongoose = require('mongoose');

const DanhMucSchema = new mongoose.Schema({
    MaDM: { type: String, required: true, unique: true },
    TenDM: { type: String, required: true },
    Hinhanh: { type: String }
});

module.exports = mongoose.model('DanhMuc', DanhMucSchema);

