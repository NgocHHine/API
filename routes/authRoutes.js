const express = require('express');
const router = express.Router();
const {
    login,
    registerController,
    verifyEmailController,
    forgotPassword,
    resetPassword,
    sendVerificationEmail
} = require('../controllers/authController');

// 📌 Định nghĩa các API xác thực
router.post('/login', login);                      // Đăng nhập
router.post('/register', registerController);      // Đăng ký tài khoản
router.get('/verify/:token', verifyEmailController); // Xác thực email
router.post('/forgot-password', forgotPassword);   // Yêu cầu đặt lại mật khẩu
router.post('/reset-password', resetPassword);     // Đặt mật khẩu mới
router.post('/send-email',sendVerificationEmail);

// 📌 Xuất tuyến API
module.exports = router;
