const User = require('../models/User');
const { generateToken } = require('../middleware/auth');
const { scoreQuiz } = require('../services/quizService');

exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const user = await User.create({ name, email, password });
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            travelPersonality: user.travelPersonality,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email }).select('+password');
        if (user && (await user.comparePassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                travelPersonality: user.travelPersonality,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMe = async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) res.json(user);
    else res.status(404).json({ message: 'User not found' });
};

exports.submitQuiz = async (req, res) => {
    try {
        const { answers } = req.body;
        const { personality, scores, profile } = scoreQuiz(answers);

        const user = await User.findById(req.user._id);
        user.travelPersonality = personality;
        user.personalityQuizAnswers = answers;
        await user.save();

        res.json({ personality, scores, profile, message: 'Quiz submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.name = req.body.name || user.name;
        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            travelPersonality: updatedUser.travelPersonality,
            token: generateToken(updatedUser._id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- Forgot Password Flow ---

const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'No account found with that email' });
        }

        const otp = generateOtp();
        const bcrypt = require('bcrypt');
        const hashedOtp = await bcrypt.hash(otp, 10);

        user.resetOtp = hashedOtp;
        user.resetOtpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        await user.save();

        // In production, send OTP via email/SMS.
        // For demo, we return it in the response so the client can display it.
        res.json({
            message: 'OTP generated successfully. Check your email.',
            _demoOtp: otp // Remove in production
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await User.findOne({ email }).select('+resetOtp +resetOtpExpires');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (!user.resetOtp || !user.resetOtpExpires) {
            return res.status(400).json({ message: 'No OTP request found. Please request a new OTP.' });
        }
        if (user.resetOtpExpires < new Date()) {
            return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
        }

        const bcrypt = require('bcrypt');
        const isValid = await bcrypt.compare(otp, user.resetOtp);
        if (!isValid) {
            return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
        }

        res.json({ message: 'OTP verified successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    try {
        const user = await User.findOne({ email }).select('+resetOtp +resetOtpExpires');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (!user.resetOtp || !user.resetOtpExpires) {
            return res.status(400).json({ message: 'No OTP request found.' });
        }
        if (user.resetOtpExpires < new Date()) {
            return res.status(400).json({ message: 'OTP has expired.' });
        }

        const bcrypt = require('bcrypt');
        const isValid = await bcrypt.compare(otp, user.resetOtp);
        if (!isValid) {
            return res.status(400).json({ message: 'Invalid OTP.' });
        }

        // Update password and clear OTP fields
        user.password = newPassword;
        user.resetOtp = undefined;
        user.resetOtpExpires = undefined;
        await user.save();

        res.json({ message: 'Password reset successfully. You can now sign in.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
