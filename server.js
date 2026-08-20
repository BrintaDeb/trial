const express = require('express');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');

const DB_FILE = path.join(__dirname, 'database.json');

// --- Persistent Database Setup ---
let db = {
    quotes: [],
    reviews: [],
    discountedEmails: [],
    knowledgeBase: [],
    leads: []
};

// Load database if it exists
if (fs.existsSync(DB_FILE)) {
    try {
        const data = fs.readFileSync(DB_FILE, 'utf8');
        db = JSON.parse(data);
    } catch (e) {
        console.error("Failed to load database.json", e);
    }
}

// Helper to save database (Asynchronous for performance)
const saveDb = () => {
    fs.writeFile(DB_FILE, JSON.stringify(db, null, 2), (err) => {
        if (err) console.error("Failed to save database.json", err);
    });
};

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

// --- Mock Users ---
const users = [
    { username: 'admin', password: 'password', role: 'admin' },
    { username: 'user', password: 'password', role: 'user' },
    { username: 'manager', password: 'password', role: 'manager' },
    { username: 'designer', password: 'password', role: 'designer' },
    { username: 'offline', password: 'password', role: 'offline_client' }
];

// Provide aliases for easy access within endpoints
let quotes = db.quotes;
let reviews = db.reviews;
let knowledgeBase = db.knowledgeBase;
let leads = db.leads;

// Set is not serializable natively in JSON, so we convert back and forth
let discountedEmails = new Set(db.discountedEmails || []);

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
    
    // Update DB
    db.discountedEmails = Array.from(discountedEmails);
    saveDb();
    
    res.json({ success: true, quote: newQuote });
});

// Get Quotes (Admin/Manager/User)
app.get('/api/quotes', (req, res) => {
    if (req.session.user) {
        if (req.session.user.role === 'admin' || req.session.user.role === 'manager') {
            res.json({ success: true, quotes });
        } else if (req.session.user.role === 'user') {
            // For mock purposes, return all quotes for the user or a specific mock email
            // In a real app, this would filter by user ID or email.
            res.json({ success: true, quotes: quotes }); 
        }
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
    saveDb();
    
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
        if (fact) {
            knowledgeBase.push({ id: Date.now(), text: fact.toLowerCase(), original: fact });
            saveDb();
        }
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
    if (!message) return res.json({ response: "I'm Atelier AI. How can I help you today?" });

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

// --- Analytics Endpoints ---
app.get('/api/analytics', (req, res) => {
    if (req.session.user && req.session.user.role === 'admin') {
        // Mock Analytics Data
        const analytics = {
            pageViews: 12450,
            uniqueVisitors: 8320,
            conversionRate: '4.2%',
            activeLeads: leads.length,
            revenueEstimate: '₹2,45,000'
        };
        res.json({ success: true, analytics });
    } else {
        res.status(403).json({ success: false, message: 'Unauthorized' });
    }
});

// Fallback to index.html for any other route
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// --- Leads & CRM Endpoints ---

// Lead Capture (Public)
app.post('/api/leads', (req, res) => {
    const { name, email, company, projectType, budget, timeline, notes } = req.body;
    const newLead = {
        id: leads.length + 1,
        name, email, company, projectType, budget, timeline, notes,
        status: 'new', // new, contacted, qualified, lost, converted
        score: Math.floor(Math.random() * 100), // Mock AI lead score
        date: new Date().toISOString()
    };
    leads.push(newLead);
    saveDb();
    res.json({ success: true, lead: newLead });
});

// Get Leads (Admin CRM)
app.get('/api/leads', (req, res) => {
    if (req.session.user && req.session.user.role === 'admin') {
        res.json({ success: true, leads });
    } else {
        res.status(403).json({ success: false, message: 'Unauthorized CRM access' });
    }
});

// Trainable CRM Command Interface
app.post('/api/crm/command', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    
    const { command } = req.body;
    const cmd = command.toLowerCase().trim();
    
    // Command Parser Logic
    try {
        if (cmd === 'clear leads' || cmd === '/clear') {
            leads.length = 0; // Clear array while keeping reference
            saveDb();
            return res.json({ success: true, message: 'All leads cleared.', action: 'refresh' });
        }
        
        if (cmd.startsWith('delete lead ') || cmd.startsWith('/delete ')) {
            const id = parseInt(cmd.split(' ').pop());
            const index = leads.findIndex(l => l.id === id);
            if (index !== -1) {
                leads.splice(index, 1);
                saveDb();
                return res.json({ success: true, message: `Lead ${id} deleted.`, action: 'refresh' });
            }
            return res.json({ success: false, message: `Lead ${id} not found.` });
        }
        
        if (cmd.startsWith('status ') || cmd.startsWith('/status ')) {
            // e.g., "status 1 contacted"
            const parts = cmd.split(' ');
            const id = parseInt(parts[1]);
            const newStatus = parts[2];
            const lead = leads.find(l => l.id === id);
            if (lead) {
                lead.status = newStatus;
                saveDb();
                return res.json({ success: true, message: `Lead ${id} marked as ${newStatus}.`, action: 'refresh' });
            }
            return res.json({ success: false, message: `Lead ${id} not found.` });
        }
        
        if (cmd === 'stats' || cmd === '/stats') {
            const total = leads.length;
            const newLeads = leads.filter(l => l.status === 'new').length;
            return res.json({ success: true, message: `CRM Stats: ${total} total leads, ${newLeads} new.`, action: 'none' });
        }

        // Catch-all
        return res.json({ success: true, message: `Command recognized but no action mapped for: "${command}". Try '/delete [id]' or '/status [id] [status]'`, action: 'none' });
        
    } catch (e) {
        return res.status(500).json({ success: false, message: 'Command failed to execute.' });
    }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
