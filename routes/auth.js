const express = require('express');
const router = express.Router();
const { User, validate } = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { queueEmail } = require('../functions/sendEmail');
const config = require('config');
const jwtExpirySeconds = 300;

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Users]
 *     requestBody:
 *       description: User to login
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *                email: "netko1@gmail.com"
 *                password: "pass"
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               data: [{ message: 'Successfully logged in', token: 'jwt token data' }]
 *       400:
 *         description: Invalid request
 */
router.post('/login', async (request, response) => {
    try {
        let user = await User.findOne({ email: request.body.email });
        if (!user) {
            return response.status(400).json({ message: 'Incorrect email or password.' });
        }
        const correctPassword = await bcrypt.compare(request.body.password, user.password);
        if (!correctPassword) {
            return response.status(400).json({ message: 'Incorrect email or password.' });
        }
        const token = jwt.sign({ id: user._id, exp: (Date.now() + (60 * 60 * 1000)) }, config.get("SECRET"));
        response.cookie(
            "token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: "strict",
            maxAge: jwtExpirySeconds * 1000
        });
        return response.status(200).json({ message: 'Successfully logged in', token: token });

    } catch (err) {
        return response.status(400).json({ message: err.message });
    }
});

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register user
 *     tags: [Users]
 *     requestBody:
 *       description: User to register
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *                name: "netko"
 *                email: "netko1@gmail.com"
 *                password: "pass"
 *     responses:
 *       201:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               data: [{ name: 'netko', email: "netko1@gmail.com" }]
 *       400:
 *         description: Invalid request
 */
router.post('/register', async (request, response) => {
    const { error } = validate(request.body);
    if (error) {
        return response.status(400).send(error.details[0].message);
    }
    let user = await User.findOne({ email: request.body.email })
    if (user) {
        return response.status(400).send('User already exisits. Please sign in');
    } else {
        try {
            const salt = await bcrypt.genSalt(10);
            const password = await bcrypt.hash(request.body.password, salt);
            const user = new User({
                name: request.body.name,
                email: request.body.email,
                password: password
            });
            await user.save();
            await queueEmail(user.email);
            return response.status(201).json({ name: user.name, email: user.email});
        } catch (err) {
            return response.status(400).json({ message: err.message });
        }
    }
});

module.exports = router;