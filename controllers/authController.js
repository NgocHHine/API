const TaiKhoan = require('../models/TaiKhoan');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const nodemailer = require('nodemailer');
const nodemailer = require("nodemailer");
require('dotenv').config();

// Đăng nhập tài khoản
const login = async (req, res) => {
    try {
      const { TenDN, Matkhau } = req.body;
  
      // Kiểm tra tài khoản có tồn tại không
      const user = await TaiKhoan.findOne({ TenDN });
      if (!user) return res.status(400).json({ message: "Tên đăng nhập không tồn tại!" });
  
      // Kiểm tra mật khẩu
      const isMatch = await bcrypt.compare(Matkhau, user.Matkhau);
      if (!isMatch) return res.status(400).json({ message: "Mật khẩu không chính xác!" });
  
      // Tạo JWT Token
      const token = jwt.sign({ id: user._id, role: user.QuyenTK }, process.env.JWT_SECRET, { expiresIn: "1h" });
  
      res.json({
        message: "Đăng nhập thành công!",
        token,
        user: { TenDN: user.TenDN, QuyenTK: user.QuyenTK }
      });
    } catch (error) {
      res.status(500).json({ message: "Lỗi server!", error });
    }
  };
  // Đảm bảo export đúng
module.exports = { login };


// Khởi tạo transporter để gửi email
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// 📌 API: Gửi email quên mật khẩu
const forgotPassword = async (req, res) => {
    try {
        const { Email } = req.body;

        // Kiểm tra email có tồn tại không
        const user = await TaiKhoan.findOne({ Email });
        if (!user) return res.status(400).json({ message: "Email không tồn tại!" });

        // Tạo token reset password (hết hạn sau 15 phút)
        const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });

        // Gửi email chứa link reset password
        const resetLink = `${process.env.BASE_URL}/reset-password/${resetToken}`;
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: Email,
            subject: "Yêu cầu đặt lại mật khẩu",
            html: `<p>Nhấn vào link sau để đặt lại mật khẩu:</p> 
                   <a href="${resetLink}">${resetLink}</a> 
                   <p>Link này có hiệu lực trong 15 phút.</p>`,
        });

        res.json({ message: "Vui lòng kiểm tra email để đặt lại mật khẩu!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// 📌 API: Đặt lại mật khẩu mới
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        console.log("Received Token:", token);

        // Xác thực token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded);

          // Kiểm tra user tồn tại hay không
          const user = await TaiKhoan.findById(decoded.id);
          if (!user) {
              return res.status(400).json({ message: "Người dùng không tồn tại!" });
          }

        // Hash mật khẩu mới
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Cập nhật mật khẩu mới vào DB
        await TaiKhoan.findByIdAndUpdate(decoded.id, { Matkhau: hashedPassword });

        res.json({ message: "Đặt lại mật khẩu thành công!" });
    } catch (error) {
        res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn." });
    }
};


// Hàm gửi email
const sendVerificationEmail = async (email, token) => {
    try {
        const verificationLink = `${process.env.BASE_URL}/api/auth/verify/${token}`;
        
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Xác nhận đăng ký tài khoản",
            html: `<p>Nhấn vào đường link sau để xác nhận tài khoản của bạn:</p>
                   <a href="${verificationLink}">${verificationLink}</a>`
        });

        console.log("📩 Email đã gửi thành công!");
    } catch (error) {
        console.error("❌ Lỗi khi gửi email:", error);
    }
};


// Đăng ký tài khoản
const registerController = async (req, res) => {
    try {
        const { TenDN, Sdt, Email, Matkhau, Gioitinh } = req.body;

        // Kiểm tra email hoặc username đã tồn tại chưa
        const existingUser = await TaiKhoan.findOne({ $or: [{ Email }, { TenDN }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Email hoặc Tên đăng nhập đã tồn tại' });
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(Matkhau, 10);

        // Tạo tài khoản mới
        const newUser = new TaiKhoan({
            TenDN,
            Sdt,
            Email,
            Matkhau: hashedPassword,
            Gioitinh
        });

        await newUser.save();

        // Tạo token xác nhận email
       const verificationToken = jwt.sign({ Email }, process.env.SECRET_KEY, { expiresIn: '1h' });
        console.log("1");
        // Gửi email xác nhận
        await sendVerificationEmail(Email, verificationToken);
        console.log("2");
        res.status(201).json({ message: 'Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// Xác nhận tài khoản qua email
const verifyEmailController = async (req, res) => {
    try {
        const { token } = req.params;
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        // Cập nhật trạng thái xác minh
        await TaiKhoan.findOneAndUpdate({ Email: decoded.Email }, { isVerified: true });

        res.json({ message: 'Xác nhận tài khoản thành công!' });
    } catch (error) {
        res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
    }
};
const SECRET_KEY = process.env.SECRET_KEY || "mysecretkey";

exports.sendVerificationEmail = async (req, res) => {
    try {
        const { email } = req.body;

        // Kiểm tra email có tồn tại không
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Email không tồn tại" });
        }

        // Tạo token xác thực (có hiệu lực 15 phút)
        const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: "15m" });

        // Gửi email chứa token
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Xác thực tài khoản",
            text: `Nhấp vào link sau để xác thực tài khoản: http://localhost:3000/verify-email?token=${token}`
        };

        await transporter.sendMail(mailOptions);

        res.json({ message: "Email xác thực đã được gửi!" });

    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};
exports.verifyAndSetNewPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        // Kiểm tra token hợp lệ
        const decoded = jwt.verify(token, SECRET_KEY);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
        }

        // Mã hóa mật khẩu mới
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.json({ message: "Mật khẩu đã được cập nhật thành công!" });

    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};


module.exports = {login, registerController, verifyEmailController, forgotPassword, resetPassword,sendVerificationEmail};

