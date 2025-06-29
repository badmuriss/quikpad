import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { handleRequest } from './handler'; // ajuste o caminho conforme seu projeto

const allowedOrigins = [
  'https://quikcode.pro',
  'https://quiknote.pro',
  'http://31.97.166.240:6011',
  'http://31.97.166.240:6012',
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Endpoints disponíveis:`);
  console.log(`  GET/PUT http://localhost:${PORT}/notes/{id}`);
  console.log(`  GET/PUT http://localhost:${PORT}/codes/{id}`);
}); 