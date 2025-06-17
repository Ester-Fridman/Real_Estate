const express = require('express');
const jwt = require('jsonwebtoken');
const verifyGoogleToken = require('../utils/verifyGoogleToken');
const User = require('../models/user');
const router = express.Router();
const logger = require('../logger');


router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        logger.warn('Email and password are required for login');
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            logger.warn(`Login attempt failed: User with email ${email} not found`);
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            logger.warn('Login attempt failed: Incorrect password');
            return res.status(401).json({ message: 'Incorrect password' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '3h' });

        const { password: _, ...userToReturn } = user.toObject();

        res.status(200).json({ message: "login successful", user: userToReturn, token });
    } catch (error) {
        logger.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/signup', async (req, res) => {
    const { fullName, email, password, phone, address, role, isGoogle } = req.body;

    if (!isGoogle && !password) {
        return res.status(400).json({ message: 'Password is required for regular registration' });
    }

    if (!fullName || !email || !password || !phone || !address || !role) {
        logger.warn('Missing required fields for user signup');
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            logger.warn(`Signup attempt failed: User with email ${email} already exists`);
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            phone,
            address,
            role: 'user'
        });

        await newUser.save();

        const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '3h' });

        const { password: _, ...userToReturn } = newUser.toObject();

        res.status(201).json({ message: 'User created successfully', user: userToReturn, token });

    } catch (error) {
        logger.error('Error during user signup:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/google-login', async (req, res) => {
    const { token } = req.body;

    if (!token) {
        logger.warn('Google token is missing in the request');
        return res.status(400).json({ message: 'Missing Google token' });
    }

    try {
        const googleUser = await verifyGoogleToken(token);
        if (!googleUser) {
            logger.warn('Invalid Google token provided');
            return res.status(401).json({ message: 'Invalid Google token' });
        }

        // בדיקה אם המשתמש כבר קיים
        let user = await User.findOne({ email: googleUser.email });

        if (!user) {
            // יצירת משתמש חדש
            user = new User({
                fullName: googleUser.name,
                email: googleUser.email,
                password: 'google-auth',
                phone: 'Not provided',
                address: 'Not provided',
                role: 'user'
            });
            await user.save();
        }

        // יצירת טוקן JWT
        const jwtToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '3h',
        });

        const { password: _, ...userToReturn } = user.toObject();

        logger.info(`Google login successful for user: ${userToReturn.email}`);
        res.status(200).json({ message: 'Google login successful', token: jwtToken, user: userToReturn });
    } catch (error) {
        logger.error('Google login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;