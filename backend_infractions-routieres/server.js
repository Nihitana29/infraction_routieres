const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');
const connectDB = require('./config/database');
const mongoSanitize = require('express-mongo-sanitize');

const rateLimit = require('express-rate-limit');

dotenv.config();

const app = express();

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100,
    message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Security Middleware
app.use(limiter);
app.use(helmet());
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(mongoSanitize());

// Routes
app.use('/api', require('./routes/api.route'));

// Error Handler
app.use((err, req, res, next) => {
    if (process.env.NODE_ENV !== 'production') {
    } else {
    }
    res.status(500).json({
        message: 'Une erreur interne est survenue',
        error: process.env.NODE_ENV !== 'production' ? err.message : {}
    });
});

// Start Server
const PORT = process.env.PORT || 3000;

/* istanbul ignore next */
if (require.main === module) {
    connectDB().then(() => {
        app.listen(PORT, () => {
        });
    }).catch(err => {
        process.exit(1);
    });
}

module.exports = app;
