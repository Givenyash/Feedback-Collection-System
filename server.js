const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public')); // Serves your HTML files

// 1. Database Connection (MongoDB)
mongoose.connect('mongodb://127.0.0.1:27017/feedbackDB')
  .then(() => console.log("Connected to MongoDB successfully!"))
  .catch(err => console.error("Database connection error:", err));

// 2. Define the Database Schema
const feedbackSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    category: String,
    message: String,
    date: { type: Date, default: Date.now }
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

// 3. Routes

// Route to serve the Form (Home)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Route to serve the Dashboard
app.get('/feedbacks', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/dashboard.html'));
});

// API: Handle Form Submission (POST)
app.post('/submit-feedback', async (req, res) => {
    try {
        const newFeedback = new Feedback(req.body);
        await newFeedback.save();
        res.status(201).json({ message: 'Feedback saved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error saving feedback' });
    }
});

// API: Get All Data for Dashboard (GET)
app.get('/api/all-feedbacks', async (req, res) => {
    try {
        const feedbacks = await Feedback.find().sort({ date: -1 }); // Newest first
        res.json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching feedbacks' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});