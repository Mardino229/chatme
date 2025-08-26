const express = require('express');
require('dotenv').config();
const { PrismaClient } = require('./generated/prisma')
const prisma = new PrismaClient();
const cors = require("cors");
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const authRouter = require('./route/authRoute');
const messageRouter = require('./route/messageRoute');

const bodyParser = require('body-parser');

const corsOptions = require('./config/corsOptions');
const http = require("http");
const {Server} = require("socket.io");
const {encrypt, decrypt} = require("./util/encryption");

const app = express();
const PORT = 3000;

app.use(credentials);

app.use(cors(corsOptions));

app.use(cookieParser());

app.use(bodyParser.json());

app.use('/auth', authRouter);
app.use('/messages', messageRouter);

const server = http.createServer(app);
const io = new Server(server,
    {
        cors: {
            origin: 'http://localhost:5173',
            methods: ['GET', 'POST'],
            credentials: true,
        },});

io.on('connection', (socket) => {
    console.log('🟢 Nouvelle connexion socket:', socket.id);

    // 📥 Lorsqu'un message est envoyé
    socket.on('sendMessage', async (data) => {
        const { content, senderId, receiverId } = data;

        try {
            // Enregistrer dans la DB
            const user = await prisma.user.findUnique({
                where: { id: parseInt(receiverId) },
            });
            const encryptedContent = encrypt(content);
            const newMessage = await prisma.message.create({
                data: {
                    content: encryptedContent,
                    senderId,
                    receiverId: user.email,
                },
            });
            console.log("Réussi", newMessage)
            const messageToSend = {
                ...newMessage,
                content: decrypt(newMessage.content),
            };
            console.log(messageToSend);

            io.emit('receiveMessage', messageToSend);
        } catch (err) {
            console.error('Erreur lors de l’enregistrement du message :', err);
        }
    });

    socket.on('disconnect', () => {
        console.log('🔴 Socket déconnecté:', socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});


