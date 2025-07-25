import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { handleRequest } from './handler.js';

const allowedOrigins = [
  'https://quikcode.pro',
  'https://quiknote.pro',
  'https://quikcode.cc',
  'https://quiknote.cc',
  'http://31.97.166.240:6011',
  'http://31.97.166.240:6012',
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

app.all('/notes/:id', (req, res) => handleRequest(req, res, '/notes/'));
app.all('/codes/:id', (req, res) => handleRequest(req, res, '/codes/'));

app.get('/health', (_req, res) => {
  res.status(200).send('OK');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`QUIKPAD RUNNING`);
}); 