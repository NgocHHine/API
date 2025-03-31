const mongoose = require('mongoose');

const TaiKhoanSchema = new mongoose.Schema({
    TenDN: { type: String, required: true, unique: true },
    Sdt: { type: Number, required: true, unique: true },
    Email: { type: String, required: true, unique: true },
    Matkhau: { type: String, required: true },
    Gioitinh: { type: Number, enum: [0, 1] },
    QuyenTK: { type: String, enum: ['user', 'admin'], default: 'user' },
    isVerified: { type: Boolean, default: false } // Trạng thái xác minh email
});

module.exports = mongoose.model('TaiKhoan', TaiKhoanSchema);
