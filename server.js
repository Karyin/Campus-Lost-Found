require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const compression = require('compression'); 

const app = express();

// Global Middleware
app.use(compression()); 
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ extended: true })); 
app.use(cors());

// Homepage redirection
app.get('/', (req, res) => {
    res.redirect('/home.html');
});

app.use(express.static('public')); 

//Modular Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/items', require('./routes/items'));

//Error Handling
app.use((req, res, next) => {
    if (req.originalUrl.startsWith('/api/')) {
        return res.status(404).json({ error: "404 - API Endpoint Not Found." });
    }
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html')); 
});

app.use((err, req, res, next) => {
    console.error(" Global Server Error:", err.stack);
    res.status(500).json({ error: "500 - Internal Server Error. Please try again later." });
});

// Connect to the database 
const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB Connected Successfully');
        app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
    })
    .catch(err => {
        console.error(' DB Connection Error:', err.message);
        process.exit(1); 
    });