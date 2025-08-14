import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { handleRequest } from './handler.js';

const allowedOrigins = [
  'https://quikcode.cc',
  'https://quiknote.cc',
  'http://localhost:6001',
  'http://localhost:6002'
];

const app = express();
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  }
}));
app.use(bodyParser.json());

// Rate limiting middleware
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 200, // Limit each IP to 200 requests per minute (accommodates 2-3s debounce)
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '1 minute'
  },
  standardHeaders: true,
  legacyHeaders: false, 
});

const healthLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // Limit health checks to 10 per minute
  message: {
    error: 'Too many health check requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.all('/notes/:id', apiLimiter, (req, res) => handleRequest(req, res, '/notes/'));
app.all('/codes/:id', apiLimiter, (req, res) => handleRequest(req, res, '/codes/'));

app.get('/health', healthLimiter, (_req, res) => {
  res.status(200).send('OK');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`QUIKPAD RUNNING`);
}); 