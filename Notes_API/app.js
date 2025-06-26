// For dotenv with ES Modules, import 'dotenv/config' at the very top.
import 'dotenv/config';
import fs from 'fs';
import path from 'path'; // Use path for constructing file paths
import https from 'https';
import express from 'express';
import session from 'express-session';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import SQLiteStoreFactory from 'connect-sqlite3';

// --- Configuration ---
// Centralize and validate environment variables for clarity and safety.
const {
    PORT = 8443,
    FRONTEND_URI,
    SESSION_SECRET_KEY,
    NODE_ENV = 'development',
    CERT_KEY_PATH = './cert/key.pem',
    CERT_PATH = './cert/cert.pem'
} = process.env;

if (!FRONTEND_URI || !SESSION_SECRET_KEY) {
    console.error('FATAL ERROR: FRONTEND_ORIGIN and SESSION_SECRET_KEY must be defined in .env');
    process.exit(1);
}

const SQLiteStore = SQLiteStoreFactory(session);

require('./db/init'); // Initialize DB

// --- Security and Middleware Setup ---

// Use Helmet with sensible defaults for security headers.
// The defaults are more secure than disabling policies.
// If you need to disable them, ensure you understand the security implications.
app.use(helmet());

// CORS configuration
app.use(cors({
    origin: FRONTEND_URI,
    credentials: true,
}));

// JSON body parser
app.use(express.json());

// Session management with SQLite
app.use(session({
    store: new SQLiteStore({
        db: 'sessions.db',
        dir: './db' // Store session db in a dedicated directory
    }),
    secret: SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: NODE_ENV === 'production', // Use secure cookies in production
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
    }
}));

// Rate limiting to prevent abuse
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: 'Too many requests from this IP, please try again after 15 minutes.',
});
app.use(apiLimiter);

// --- Routes ---
import authRoutes from './routes/auth.js';
import notesRoutes from './routes/notes.js';

// --- Server Startup ---
try {
    // HTTPS options from environment variables
    const httpsOptions = {
        key: fs.readFileSync(path.resolve(__dirname, CERT_KEY_PATH)),
        cert: fs.readFileSync(path.resolve(__dirname, CERT_PATH)),
    };

    app.use('/api/auth', authRoutes);
    app.use('/api/notes', notesRoutes);

    const server = https.createServer(httpsOptions, app).listen(PORT, () => {
        console.log(`✅ HTTPS server running on port ${PORT} in ${NODE_ENV} mode.`);
    });

    // Graceful shutdown
    const shutdown = (signal) => {
        console.log(`\n${signal} received. Shutting down gracefully...`);
        server.close(() => {
            console.log('✅ Server closed.');
            // Close database connections here if necessary
            process.exit(0);
        });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));

} catch (error) {
    console.error('❌ Failed to start server:', error.message);
    if (error.code === 'ENOENT') {
        console.error('Hint: Make sure your certificate files are correctly located at the paths specified by CERT_KEY_PATH and CERT_PATH in your .env file.');
    }
    process.exit(1);
}
