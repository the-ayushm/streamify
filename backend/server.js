import { setDefaultResultOrder } from 'dns';
setDefaultResultOrder('ipv4first');
import express from 'express'
import cors from 'cors'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js';
import conversationRoutes from './routes/conversationRoutes.js'
import messageRoutes from './routes/message.routes.js'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import http from 'http';
import { Server } from 'socket.io';
import Message from './models/message.model.js';

dotenv.config();
const app = express();

const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:5173',
    'http://127.0.0.1:5173',
].filter(Boolean);

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
        }

        callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
};

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        credentials: true,
    },
})

const PORT = process.env.PORT || 5000;

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes)
app.use('/api/conversation', conversationRoutes);
app.use('/api/messages', messageRoutes);

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB Connected!");
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB!", err)
    })

const onlineUsers = new Map();

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on("register-user", (userId) => {
        onlineUsers.set(userId, socket.id)
        io.emit("online-users", Array.from(onlineUsers.keys()))
    })

    socket.on("join-room", (conversationId) => {
        socket.join(conversationId)
        console.log("joined room:", conversationId)
    })

    socket.on("send-message", ({ conversationId, message }) => {
        socket.to(conversationId).emit("receive-message", message)
    })

    socket.on("message-delivered", async ({ messageId, conversationId }) => {
        await Message.findByIdAndUpdate(messageId, {
            delivered: true
        })
        io.to(conversationId).emit("message-delivered-update", { messageId })
    })

    socket.on("message-read", async (conversationId) => {
        await Message.updateMany({ conversationId, read: false }, { read: true })
        io.to(conversationId).emit("message-read-update", { conversationId })
    })

    socket.on("typing", (conversationId) => {
        socket.to(conversationId).emit("user-typing")
    })

    socket.on("stop-typing", (conversationId) => {
        socket.to(conversationId).emit("user-stop-typing")
    })

    socket.on("call-user", ({ to, caller, offer }) => {
        const receiverSocketId = onlineUsers.get(to)
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("incoming-call", {
                caller,
                offer
            })
        }
    })

    socket.on("answer-call", ({ to, answer }) => {
        const receiverSocketId = onlineUsers.get(to)
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("call-answered", {
                answer
            })
        }
    })

    socket.on("ice-candidate", ({ to, candidate }) => {
        const receiverSocketId = onlineUsers.get(to)
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("ice-candidate", {
                candidate
            })
        }
    })

    socket.on('disconnect', () => {
        console.log('user disconnected');
        for (let [userId, socketId] of onlineUsers.entries()) {
            if (socketId === socket.id) {
                onlineUsers.delete(userId)
                break
            }
        }

        io.emit("online-users", Array.from(onlineUsers.keys()))
    });

    socket.on("leave-room", (conversationId) => {
        socket.leave(conversationId)
    })
});



server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`)
})