const mongoose = require('mongoose');

const DatLichHenSchema = new mongoose.Schema({
    MaDM: { type: String, required: true, ref: 'DanhMuc' },
    Ma_LV: { type: String },
    Hoten_DL: { type: String, required: true },
    SDT_DL: { type: Number, required: true },
    Hoten_BN: { type: String, required: true },
    Gioitinh: { type: Number, enum: [0, 1], required: true },
    Email: { type: String },
    Namsinh: { type: Number, required: true },
    Diachi: { type: String, required: true },
    Lydokham: { type: String }
});

module.exports = mongoose.model('DatLichHen', DatLichHenSchema);
