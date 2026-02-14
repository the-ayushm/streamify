# 🚀 Streamify – Full Stack Real-Time Chat Application

A production-style real-time chat application built using **React, Node.js, MongoDB, and Socket.IO**.

This project demonstrates scalable real-time architecture including message delivery tracking, read receipts, online presence, and typing indicators — similar to WhatsApp or Messenger.

---

## 🧠 Overview

Streamify is a full-stack real-time messaging platform that supports:

- 💬 Instant messaging using WebSockets
- 🟢 Live online/offline user tracking
- ✔ Sent / Delivered / Read message indicators
- ✍ Typing indicator
- 🔐 Cookie-based authentication / JWT with refresh tokens
- 🏠 Room-based conversation architecture
- 📱 Responsive UI

This project focuses on implementing real-time communication correctly with proper state synchronization between multiple clients.

---

## 🛠 Tech Stack

### Frontend
- React (Vite)
- TypeScript
- Tailwind CSS
- Socket.io-client
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Socket.IO
- Cookie Parser
- CORS

---

## 🏗 Architecture Design

### 🔹 Real-Time Communication

- Each user connects via Socket.IO
- Users are stored in a `Map<userId, socketId>`
- Conversations use Socket.IO rooms
- Messages are broadcast using `socket.to(roomId).emit()`

### 🔹 Message Status Flow

| Status        | Condition |
|-------------|------------|
| Sent        | Message saved in DB |
| Delivered   | Receiver socket receives message |
| Read        | Receiver opens conversation |

---

## 🔌 Socket Flow

### 1️⃣ User Connection

```js
socket.emit("register-user", userId)
```

Server stores:
```js
onlineUsers.set(userId, socket.id)
```

---

### 2️⃣ Sending Message

Frontend:
```js
socket.emit("send-message", { conversationId, message })
```

Server:
```js
socket.to(conversationId).emit("receive-message", message)
```

---

### 3️⃣ Delivery Acknowledgement

Receiver:
```js
socket.emit("message-delivered", { messageId })
```

Server updates DB and emits:
```js
io.to(conversationId).emit("message-delivered-update", { messageId })
```

---

### 4️⃣ Read Receipt

When conversation is opened:
```js
socket.emit("message-read", conversationId)
```

Server:
```js
io.to(conversationId).emit("message-read-update", { conversationId })
```

---

## 📂 Project Structure

```
streamify/
│
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── lib/socket.ts
│   ├── utils/formatMessage.ts
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── server.js
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/streamify.git
cd streamify
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

Run server:

```bash
npm start
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

App runs on:
```
http://localhost:5173
```

---

## ✨ Key Features Implemented

- Room-based chat architecture
- Online user tracking using `Map`
- Message delivery tracking stored in MongoDB
- Read receipts synchronization
- Real-time typing indicator
- Optimized socket connection lifecycle
- Clean UI state management
- Reusable message formatting utility

---

## 📈 What This Project Demonstrates

✔ Real-time system design  
✔ Socket lifecycle management  
✔ Multi-client state synchronization  
✔ Event-driven architecture  
✔ Clean separation of frontend & backend  
✔ Practical understanding of WebSockets  

---

## 🚀 Future Improvements

- File & image sharing
- Message pagination
- Push notifications
- Group chats
- Cloud deployment (Vercel + Render)
- Redis for scalable socket sessions

---

## 👨‍💻 Author

**Ayush Kesharwani**  
---


---

⭐ If you found this useful, consider giving it a star.
