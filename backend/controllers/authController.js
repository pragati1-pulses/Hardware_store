const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendOTPEmail = require('../utils/emailSender');
const { Op } = require('sequelize');

// A secret key used to generate the token (in a real app, keep this in .env)
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_hardware_key';

// 1. Register a new user
exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        
        // Hash the password (add random characters to it so it's unreadable)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const newUser = await User.create({ 
            name, 
            email, 
            password: hashedPassword, 
            role 
        });
        
        res.status(201).json({ message: "User created successfully", user: { id: newUser.id, name, email, role } });
    } catch (error) {
        console.error(error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: "Email already exists" });
        }
        res.status(500).json({ error: "Failed to create user" });
    }
};

// 2. Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Check if the typed password matches the hashed password in DB
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Generate a token (like a VIP pass) that lasts for 1 day
        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

        res.json({ 
            message: "Login successful", 
            token, 
            user: { id: user.id, name: user.name, role: user.role, email: user.email } 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Login failed" });
    }
};

// 3. Get all users (For the User Management page)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] }, // Hide passwords
            order: [['id', 'DESC']]
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
};   



// 4. FORGOT PASSWORD (Generate OTP)
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ error: "User with this email does not exist." });
        }

        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save OTP and expiry (10 minutes)
        user.reset_password_token = otp;
        user.reset_password_expires = Date.now() + 600000; // 10 mins
        await user.save();

        // Try sending the email
        const emailSent = await sendOTPEmail(email, otp);
        
        if (emailSent) {
            res.json({ message: "OTP has been sent to your email address." });
        } else {
            // Offline fallback
            console.log("=========================================");
            console.log(`🔐 OFFLINE PASSWORD RESET FOR: ${email}`);
            console.log(`🔑 YOUR OTP IS: ${otp}`);
            console.log("=========================================");
            
            res.json({ message: "Offline mode: OTP generated. Please check the server terminal." });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to process request" });
    }
};

// 5. RESET PASSWORD (Verify OTP & Save new password)
exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, password } = req.body;

        // Find user with matching email and valid OTP
        const user = await User.findOne({ 
            where: { 
                email: email,
                reset_password_token: otp,
                reset_password_expires: { [Op.gt]: Date.now() } 
            } 
        });

        if (!user) {
            return res.status(400).json({ error: "Invalid OTP or OTP has expired." });
        }

        // Hash new password
        const bcrypt = require('bcryptjs');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Update password and clear OTP
        user.password = hashedPassword;
        user.reset_password_token = null;
        user.reset_password_expires = null;
        await user.save();

        res.json({ message: "Password reset successfully. You can now login." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to reset password" });
    }
};