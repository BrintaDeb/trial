require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const multer = require('multer');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const app = express();
const PORT = process.env.PORT || 3000;

// --- Mongoose Database Setup ---
if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI)
        .then(() => console.log('Connected to MongoDB Atlas'))
        .catch(err => console.error('MongoDB connection error:', err));
} else {
    console.warn('WARNING: MONGODB_URI is not defined in .env. The server will run, but database operations will fail.');
}

// Mongoose Schemas
const QuoteSchema = new mongoose.Schema({
    email: String,
    companyName: String,
    gstNumber: String,
    address: String,
    selections: Array,
    total: Number,
    hours: Number,
    applyDiscount: Boolean,
    istTimestamp: String,
    status: { type: String, default: 'Pending' }
});
const Quote = mongoose.model('Quote', QuoteSchema);

const ReviewSchema = new mongoose.Schema({
    name: String,
    rating: Number,
    comment: String,
    photoUrl: String
});
const Review = mongoose.model('Review', ReviewSchema);



const LeadSchema = new mongoose.Schema({
    name: String,
    email: String,
    company: String,
    projectType: String,
    notes: String,
    budget: String,
    timeline: String,
    score: Number,
    status: { type: String, default: 'New' },
    date: { type: Date, default: Date.now }
});
const Lead = mongoose.model('Lead', LeadSchema);

const DiscountedEmailSchema = new mongoose.Schema({ email: String });
const DiscountedEmail = mongoose.model('DiscountedEmail', DiscountedEmailSchema);

// Portfolio Project Schema
const ProjectSchema = new mongoose.Schema({
    title: String,
    description: String,
    mediaUrl: String,
    mediaType: { type: String, default: 'image' }, // 'image' or 'video'
    date: { type: Date, default: Date.now }
});
const Project = mongoose.model('Project', ProjectSchema);

// Local Business Lead Schema
const LocalLeadSchema = new mongoose.Schema({
    name: String,
    email: String,
    searchQuery: String,
    date: { type: Date, default: Date.now }
});
const LocalLead = mongoose.model('LocalLead', LocalLeadSchema);

// --- Multer config for photo uploads ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// --- Middleware ---
app.use(bodyParser.json());
app.use(session({
    secret: process.env.SESSION_SECRET || 'elevate-next-gen-secret',
    resave: false,
    saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'public')));

// --- Mock Users (Still in memory for simplicity of this demo) ---
const users = [
    { username: 'admin', password: 'password', role: 'admin' },
    { username: 'user', password: 'password', role: 'user' },
    { username: 'manager', password: 'password', role: 'manager' },
    { username: 'designer', password: 'password', role: 'designer' },
    { username: 'offline', password: 'password', role: 'offline_client' }
];

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
app.post('/api/quotes', async (req, res) => {
    const { selections, total, email, companyName, gstNumber, address, hours, applyDiscount } = req.body;
    
    try {
        if (applyDiscount) {
            const existingDiscount = await DiscountedEmail.findOne({ email: email.toLowerCase() });
            if (existingDiscount) {
                return res.status(403).json({ success: false, message: 'Discount already claimed for this email address. Nice try!' });
            }
            await DiscountedEmail.create({ email: email.toLowerCase() });
        }

        const istTimestamp = new Intl.DateTimeFormat('en-IN', {
            timeZone: 'Asia/Kolkata',
            dateStyle: 'full',
            timeStyle: 'long'
        }).format(new Date());

        const newQuote = await Quote.create({ 
            selections, total, email, companyName, gstNumber, address, hours, applyDiscount, istTimestamp
        });
        
        res.json({ success: true, quote: newQuote });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Database Error' });
    }
});

// Get Quotes (Admin/Manager/User)
app.get('/api/quotes', async (req, res) => {
    if (!req.session.user) return res.status(403).json({ success: false, message: 'Unauthorized' });
    
    try {
        if (req.session.user.role === 'admin' || req.session.user.role === 'manager') {
            const quotes = await Quote.find();
            res.json({ success: true, quotes });
        } else if (req.session.user.role === 'user') {
            const quotes = await Quote.find(); // In a real app, filter by email
            res.json({ success: true, quotes }); 
        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Database Error' });
    }
});

// Submit Review Endpoint
app.post('/api/reviews', upload.single('photo'), async (req, res) => {
    const { name, rating, comment } = req.body;
    const photoUrl = req.file ? `/uploads/${req.file.filename}` : null;
    
    try {
        const newReview = await Review.create({ name, rating, comment, photoUrl });
        res.json({ success: true, review: newReview });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Database Error' });
    }
});

// Get Reviews
app.get('/api/reviews', async (req, res) => {
    try {
        const reviews = await Review.find();
        res.json({ success: true, reviews });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Database Error' });
    }
});

// In-memory fallback for projects when DB is not connected
const inMemoryProjects = [];

// Submit Project Endpoint
app.post('/api/projects', upload.single('media'), async (req, res) => {
    const { title, description, mediaType } = req.body;
    const mediaUrl = req.file ? `/uploads/${req.file.filename}` : null;
    
    try {
        if (mongoose.connection.readyState === 1) {
            const newProject = await Project.create({ title, description, mediaType, mediaUrl });
            res.json({ success: true, project: newProject });
        } else {
            console.warn("DB not connected, saving project to in-memory array for demo.");
            const newProject = { title, description, mediaType, mediaUrl, date: new Date() };
            inMemoryProjects.unshift(newProject); // add to top
            res.json({ success: true, project: newProject });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Database Error' });
    }
});

// Get Projects Endpoint
app.get('/api/projects', async (req, res) => {
    try {
        if (mongoose.connection.readyState === 1) {
            const projects = await Project.find().sort({ date: -1 });
            res.json({ success: true, projects });
        } else {
            res.json({ success: true, projects: inMemoryProjects });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Database Error' });
    }
});

// --- Content Management System ---
const ContentSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    value: { type: String, required: true }
});
const Content = mongoose.model('Content', ContentSchema);

let inMemoryContent = {
    'about_text': 'I am a Digital nomad currently based in Agartala Tripura. I\'ve been working in graphic design for the past 4 years. It was only in the past year that I decided to focus full-time on UI/UX Designing.',
    'career_timeline': JSON.stringify([
        { date: "JAN 2024 - PRESENT", title: "Motion Graphics & Web Developer", status: "NOW", desc: "Working with websites and managing all media @ World Mark Foundation." },
        { date: "OCT 2024 - DEC 2024", title: "Image Editing and Designing", status: "DONE", desc: "Working with targets and managing design for Ajio products @ Netscribes India Pvt. Ltd." },
        { date: "JUNE 2024 - AUG 2024", title: "Graphic Designer", status: "DONE", desc: "Working with a big development team to manage design, content, branding and social media @ Minerva Infotech." },
        { date: "2019 - 2021", title: "Junior Graphic Designer", status: "DONE", desc: "Working with a small team to manage design, content, branding and logo design @ Angel Engineering Solution." }
    ])
};

app.get('/api/content', async (req, res) => {
    try {
        if (mongoose.connection.readyState === 1) {
            const contents = await Content.find();
            const contentMap = {};
            contents.forEach(c => contentMap[c.key] = c.value);
            res.json({ success: true, content: { ...inMemoryContent, ...contentMap } });
        } else {
            res.json({ success: true, content: inMemoryContent });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Database Error' });
    }
});

app.post('/api/content', async (req, res) => {
    if (!req.session.user || (req.session.user.role !== 'admin' && req.session.user.role !== 'manager')) {
        return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    const { key, value } = req.body;
    try {
        if (mongoose.connection.readyState === 1) {
            await Content.findOneAndUpdate({ key }, { value }, { upsert: true });
        } else {
            inMemoryContent[key] = value;
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Database Error' });
    }
});


// Get Analytics (Mock data)
app.get('/api/analytics', (req, res) => {
    if (req.session.user && (req.session.user.role === 'admin' || req.session.user.role === 'manager')) {
        res.json({
            success: true,
            analytics: {
                pageViews: 12450,
                uniqueVisitors: 8900,
                conversionRate: '4.2%',
                activeLeads: 42,
                revenueEstimate: '₹4,50,000'
            }
        });
    } else {
        res.status(403).json({ success: false, message: 'Unauthorized' });
    }
});

// Capture Lead & Send Email
app.post('/api/leads', async (req, res) => {
    const { name, email, company, projectType, notes, budget, timeline } = req.body;
    
    // Determine AI Score (0-100) based on completeness and keywords
    let score = 50; 
    if (budget.includes('Lakh') || budget.includes('50,000+')) score += 30;
    if (timeline.includes('Immediate')) score += 20;
    if (notes.length > 50) score += 10;
    score = Math.min(score, 100);

    try {
        let newLead = { _id: Date.now(), name, email, company, projectType, notes, budget, timeline, score };
        if (mongoose.connection.readyState === 1) {
            newLead = await Lead.create({
                name, email, company, projectType, notes, budget, timeline, score
            });
        }
        
        // Attempt to send email
        if (process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.SMTP_EMAIL,
                    pass: process.env.SMTP_PASSWORD
                }
            });

            const mailOptions = {
                from: process.env.SMTP_EMAIL,
                to: process.env.SMTP_EMAIL, // Send to yourself
                subject: `New Portfolio Message from ${name}`,
                html: `
                    <h2>New Lead/Contact Message</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Message:</strong> ${notes}</p>
                    <hr/>
                    <small>Generated via Portfolio Backend</small>
                `
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error("Error sending email:", error);
                } else {
                    console.log("Email sent: " + info.response);
                }
            });
        }

        res.json({ success: true, lead: newLead });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Database/Server Error' });
    }
});

// Get Leads (Admin/Manager)
app.get('/api/leads', async (req, res) => {
    if (req.session.user && (req.session.user.role === 'admin' || req.session.user.role === 'manager')) {
        try {
            const leads = await Lead.find().sort({ date: -1 });
            res.json({ success: true, leads });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Database Error' });
        }
    } else {
        res.status(403).json({ success: false, message: 'Unauthorized' });
    }
});

// CRM Terminal Commands
app.post('/api/crm/command', async (req, res) => {
    if (!req.session.user || (req.session.user.role !== 'admin' && req.session.user.role !== 'manager')) {
        return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const { command } = req.body;
    if (!command) return res.json({ success: false, message: 'No command provided.' });

    const cmd = command.toLowerCase().trim();
    
    try {
        if (cmd === 'clear leads' || cmd === '/clear') {
            await Lead.deleteMany({});
            return res.json({ success: true, message: 'All leads cleared.', action: 'refresh' });
        }
        
        if (cmd.startsWith('delete lead ') || cmd.startsWith('/delete ')) {
            const idPart = cmd.split(' ').pop();
            // Since ID was Date.now() earlier, but is now a Mongo ObjectId, this command needs to match exactly or we use a different strategy.
            // For simplicity, we assume the user types the exact _id, OR we just ignore this for now and rely on future UI.
            const lead = await Lead.findByIdAndDelete(idPart);
            if (lead) {
                return res.json({ success: true, message: `Lead deleted.`, action: 'refresh' });
            }
            return res.json({ success: false, message: `Lead not found.` });
        }
        
        if (cmd.startsWith('status ') || cmd.startsWith('/status ')) {
            // e.g., "status <mongo_id> contacted"
            const parts = cmd.split(' ');
            const id = parts[1];
            const newStatus = parts[2];
            const lead = await Lead.findByIdAndUpdate(id, { status: newStatus }, { new: true });
            if (lead) {
                return res.json({ success: true, message: `Lead marked as ${newStatus}.`, action: 'refresh' });
            }
            return res.json({ success: false, message: `Lead not found.` });
        }

        res.json({ success: false, message: `Command '${command}' not recognized.` });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Database Error during command execution.' });
    }
});

// --- Local Business Lead Magnet Endpoints ---

// Mock Places API endpoint
app.get('/api/places-mock', (req, res) => {
    const query = req.query.q || '';
    
    // Simulate API delay
    setTimeout(() => {
        // Return a mock list of businesses based on query
        res.json({
            success: true,
            places: [
                { name: `Top ${query.split(' ')[0] || 'Business'} Solutions`, rating: 4.8, address: "123 Main St", phone: "+1 (555) 123-4567" },
                { name: `Elite Local ${query.split(' ')[0] || 'Services'}`, rating: 4.6, address: "456 Market Ave", phone: "+1 (555) 987-6543" },
                { name: `Pro ${query.split(' ')[0] || 'Group'}`, rating: 4.9, address: "789 Tech Blvd", phone: "+1 (555) 456-7890" },
                { name: `CityWide ${query.split(' ')[0] || 'Experts'}`, rating: 4.5, address: "101 Center Sq", phone: "+1 (555) 222-3333" },
                { name: `Reliable ${query.split(' ')[0] || 'Agency'}`, rating: 4.7, address: "202 West End", phone: "+1 (555) 888-9999" }
            ],
            totalFound: 24
        });
    }, 800);
});

// Capture the lead and return unlocked data
app.post('/api/capture-local-lead', async (req, res) => {
    const { name, email, searchQuery } = req.body;
    
    try {
        let leadId = `mock-${Date.now()}`;
        if (mongoose.connection.readyState === 1) {
            const newLead = await LocalLead.create({ name, email, searchQuery });
            leadId = newLead._id;
        } else {
            console.warn("DB not connected, skipping lead creation but returning success for demo.");
        }
        
        res.json({
            success: true,
            message: "Lead captured successfully",
            leadId: leadId
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Database Error' });
    }
});

// Start Server (Used for local development)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

// Export for Vercel Serverless
module.exports = app;
