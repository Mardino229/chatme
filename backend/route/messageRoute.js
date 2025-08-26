
const express = require('express');
const { PrismaClient } = require('../generated/prisma')
const requireToken = require('../middleware/auth');
const {decrypt, encrypt} = require("../util/encryption");

const prisma = new PrismaClient();
const router = express.Router();

router.get('/conversations', requireToken, async (req, res) => {

    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
        });
        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: user.email },
                    { receiverId: user.email }
                ]
            },
            orderBy: { timestamp: 'desc' },
            select: {
                content: true,
                timestamp: true,
                senderId: true,
                receiverId: true
            }
        });
        const conversationMap = new Map();

        messages.forEach((msg) => {
            const otherUserId =
                msg.senderId === user.id ? msg.receiverId : msg.senderId;

            if (!conversationMap.has(otherUserId)) {
                conversationMap.set(otherUserId, {
                    userId: otherUserId,
                    lastMessage: {
                        content: decrypt(msg.content),
                        timestamp: msg.timestamp,
                    },
                });
            }
        });

        const userIds = Array.from(conversationMap.keys());

        const users = await prisma.user.findMany({
            // where: { email: { in: userIds } },
            where: { id: { not: req.user.userId } },
            select: { id: true, name: true, email: true }
        });

        const response = users.map((user) => ({
            user,
            lastMessage: messages.length > 0? conversationMap.get(user.email).lastMessage: {
                content: "Aucun message pour l'instant",
                timestamp: "",
            },
        }));

        res.json(response);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: `Erreur serveur: ${err.message}` });
    }
});

router.post('/', requireToken, async (req, res) => {
    const { receiverId, content } = req.body;

    if (!receiverId || !content) {
        return res.status(400).json({ error: 'Contenu ou destinataire manquant' });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
        });
        const user2 = await prisma.user.findUnique({
            where: { id: parseInt(receiverId) },
        });
        const message = await prisma.message.create({
            data: {
                senderId: user.email,
                receiverId: user2.email,
                content: encrypt(content),
            },
        });

        res.status(201).json({ ...message, content: decrypt(message.content) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: `Erreur lors de l\'envoi du message: ${err}` });
    }
});

router.get('/:receiver', requireToken, async (req, res) => {
    const otherUserId = parseInt(req.params.receiver);

    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
        });
        const user2 = await prisma.user.findUnique({
            where: { id: otherUserId },
        });
        const encryptedMessages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: user.email, receiverId: user2.email },
                    { senderId: user2.email, receiverId: user.email }
                ]
            },
            orderBy: {
                timestamp: 'asc',
            },
        });
        const messages = encryptedMessages.map((msg) => {
            return {...msg, content: decrypt(msg.content)};
        })

        res.json({ messages });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: `Erreur lors de la récupération des messages: ${err}` });
    }
});

module.exports = router;
