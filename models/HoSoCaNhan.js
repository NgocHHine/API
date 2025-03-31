const mongoose = require('mongoose');

const HoSoCaNhanSchema = new mongoose.Schema({
    Id: { type: String, required: true, unique: true },
    Trinhdo: { type: String },
    Hoten: { type: String, required: true },
    Chuyenkhoa: { type: String },
    Quatrinhcongtac: { type: String },
    Khamvadeutri: { type: String },
    Hinhanh: { type: String },
    Ngay: { type: Date },
    Gio: { type: String }
});

module.exports = mongoose.model('HoSoCaNhan', HoSoCaNhanSchema);
