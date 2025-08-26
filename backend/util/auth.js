
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

function hashPassword(password) {
    return bcryptjs.hash(password, 10);
}

function comparePasswords(password, hash) {
    return bcryptjs.compare(password, hash);
}

function generateToken(userId) {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

function verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
}

module.exports = {hashPassword, comparePasswords, generateToken, verifyToken};
