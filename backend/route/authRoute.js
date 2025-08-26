
const express = require('express');
const { PrismaClient } = require('../generated/prisma')
const requireToken = require('../middleware/auth');
const { hashPassword, comparePasswords, generateToken } = require('../util/auth');

const prisma = new PrismaClient();
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    const { email, name, password } = req.body;
    console.log(req.body);

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email déjà utilisé.' });

    const hashed = await hashPassword(password);

    const user = await prisma.user.create({
        data: { email, name, password: hashed },
    });

    res.json({ message: "Inscription réussie" }).status(201);
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: 'Utilisateur introuvable.' });

    const isValid = await comparePasswords(password, user.password);
    if (!isValid) return res.status(401).json({ error: 'Email ou Mot de passe incorrect' });

    const token = generateToken(user.id);

    res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 jours
    });

    res.json({ user: { id: user.id, email: user.email, name: user.name } });
});

router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Déconnecté avec succès.' });
});

router.get('/me', requireToken, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
            select: {
                id: true,
                email: true,
                name: true,
            },
        });

        if (!user) return res.status(404).json({ error: "Utilisateur introuvable." });

        res.json({ user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur." });
    }
});

module.exports = router;

