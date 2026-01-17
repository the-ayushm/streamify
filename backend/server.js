import express from 'express'
import cors from 'cors'
import authRoutes from './routes/authRoutes.js'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:5173',
    credentials: true
 }));
app.use(express.json());

app.use('/api/auth', authRoutes);
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB Connected!");
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB!", err)
    })

app.listen(PORT, () => { console.log(`Server running on port ${PORT}`) })