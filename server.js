const express = require('express');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

// Multer config for photo uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Middleware
app.use(bodyParser.json());
app.use(session({
    secret: 'elevate-next-gen-secret',
    resave: false,
    saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'public')));

// --- Mock Database ---
const users = [
    { username: 'admin', password: 'password', role: 'admin' },
    { username: 'user', password: 'password', role: 'user' },
    { username: 'manager', password: 'password', role: 'manager' },
    { username: 'designer', password: 'password', role: 'designer' },
    { username: 'offline', password: 'password', role: 'offline_client' }
];

const quotes = [];
const reviews = [];
const discountedEmails = new Set(); // To track abuse of the new client discount
const knowledgeBase = []; // AI Training data

// --- API Endpoints ---

// Login Endpoint
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        req.session.user = user;
        res.json({ success: true, role: user.role });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// Logout Endpoint
app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

// Submit Quote Endpoint
app.post('/api/quotes', (req, res) => {
    const { selections, total, email, companyName, gstNumber, address, hours, applyDiscount } = req.body;
    
    // Anti-Abuse Logic for Subscriptions
    if (applyDiscount) {
        if (discountedEmails.has(email.toLowerCase())) {
            return res.status(403).json({ success: false, message: 'Discount already claimed for this email address. Nice try!' });
        }
        discountedEmails.add(email.toLowerCase());
    }

    // Generate IST Timestamp
    const istTimestamp = new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        dateStyle: 'full',
        timeStyle: 'long'
    }).format(new Date());

    const newQuote = { 
        id: Date.now(), 
        selections, 
        total, 
        email, 
        companyName, 
        gstNumber, 
        address,
        hours,
        applyDiscount, 
        istTimestamp,
        status: 'Pending' 
    };
    quotes.push(newQuote);
    res.json({ success: true, quote: newQuote });
});

// Get Quotes (Admin/Manager only)
app.get('/api/quotes', (req, res) => {
    if (req.session.user && (req.session.user.role === 'admin' || req.session.user.role === 'manager')) {
        res.json({ success: true, quotes });
    } else {
        res.status(403).json({ success: false, message: 'Unauthorized' });
    }
});

// Submit Review Endpoint (with photo)
app.post('/api/reviews', upload.single('photo'), (req, res) => {
    const { name, rating, comment } = req.body;
    const photoUrl = req.file ? `/uploads/${req.file.filename}` : null;
    
    const newReview = { id: Date.now(), name, rating, comment, photoUrl };
    reviews.push(newReview);
    
    res.json({ success: true, review: newReview });
});

// Get Reviews
app.get('/api/reviews', (req, res) => {
    res.json({ success: true, reviews });
});

// --- AI Chatbot Endpoints ---

// Train AI
app.post('/api/train-ai', (req, res) => {
    if (req.session.user && (req.session.user.role === 'admin' || req.session.user.role === 'manager')) {
        const { fact } = req.body;
        if (fact) knowledgeBase.push({ id: Date.now(), text: fact.toLowerCase(), original: fact });
        res.json({ success: true, knowledgeBase });
    } else {
        res.status(403).json({ success: false, message: 'Unauthorized to train AI' });
    }
});

// Get Knowledge Base
app.get('/api/knowledge-base', (req, res) => {
    res.json({ success: true, knowledgeBase });
});

// Chat with AI
app.post('/api/chat', (req, res) => {
    const { message } = req.body;
    if (!message) return res.json({ response: "I'm Elevate AI. How can I help you today?" });

    const userWords = message.toLowerCase().split(' ').filter(w => w.length > 3);
    
    // Smart Keyword Matching Algorithm
    let bestMatch = null;
    let highestScore = 0;

    knowledgeBase.forEach(fact => {
        let score = 0;
        userWords.forEach(word => {
            if (fact.text.includes(word)) score++;
        });
        if (score > highestScore) {
            highestScore = score;
            bestMatch = fact.original;
        }
    });

    if (bestMatch && highestScore > 0) {
        res.json({ response: bestMatch });
    } else {
        res.json({ response: "I'm still learning! If I can't answer your question, please leave a message or request a quote." });
    }
});

// Fallback to index.html for any other route
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
