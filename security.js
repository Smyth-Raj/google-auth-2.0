import express from 'express';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());

const PORT = process.env.PORT || 6000;
const SECRET_KEY = process.env.SECRET_KEY || 'your_secret_key';

// Dummy Data
const sampleData = [
    { id: 1, name: "Alice", role: "Admin" },
    { id: 2, name: "Bob", role: "User" }
];

// Middleware to Verify JWT
const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extract Bearer token
    if (!token) return res.status(401).json({ error: "Access Denied. No token provided." });

    try {
        req.user = jwt.verify(token, SECRET_KEY);
        next();
    } catch (err) {
        res.status(403).json({ error: "Invalid token!" });
    }
};

// 🔐 **Secure GET API**
app.get('/data', authenticateToken, (req, res) => {
    res.json({ success: true, data: sampleData });
});

// 🛠 **Generate Token API**
app.post('/auth', (req, res) => {
    const token = jwt.sign({ user: "admin" }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
