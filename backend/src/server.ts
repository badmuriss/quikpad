import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { handleRequest } from './handler';

const corsOptions = {
    origin: ['https://api.quikpad.pro', 'https://quikcode.pro', 'https://quiknote.pro'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
};

const app = express();
app.use(cors(corsOptions));
app.use(bodyParser.json());

app.all('/notes/:id', (req, res) => handleRequest(req, res, '/notes/'));
app.all('/codes/:id', (req, res) => handleRequest(req, res, '/codes/'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Endpoints disponíveis:`);
  console.log(`  GET/PUT http://localhost:${PORT}/notes/{id}`);
  console.log(`  GET/PUT http://localhost:${PORT}/codes/{id}`);
}); 