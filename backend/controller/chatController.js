

const express = require('express');
const { PrismaClient } = require('../generated/prisma')
const requireToken = require('../middleware/auth');

const prisma = new PrismaClient();
const router = express.Router();

const getConversations = async (req, res) => {

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
                        content: msg.content,
                        timestamp: msg.timestamp,
                    },
                });
            }
        });

        const userIds = Array.from(conversationMap.keys());

        const users = await prisma.user.findMany({
            where: { email: { in: userIds } },
            select: { id: true, name: true, email: true }
        });

        const response = users.map((user) => ({
            user,
            lastMessage: conversationMap.get(user.email).lastMessage
        }));

        res.json(response);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: `Erreur serveur: ${err.message}` });
    }
}

const sendMessage =async (req, res) => {
    const { receiverId, content } = req.body;

    if (!receiverId || !content) {
        return
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
        });
        const message = await prisma.message.create({
            data: {
                senderId: user.email,
                receiverId,
                content,
            },
        });

        return  message ;
    } catch (err) {
        console.error(err);
    }
}

const getHistory = async (req, res) => {
    const otherUserId = parseInt(req.params.receiver);

    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
        });
        const user2 = await prisma.user.findUnique({
            where: { id: otherUserId },
        });
        const messages = await prisma.message.findMany({
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
    } catch (err) {
        console.error(err);
    }
}

module.exports = router;
