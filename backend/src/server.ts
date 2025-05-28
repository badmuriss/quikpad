import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { handleRequest } from './handler'; // ajuste o caminho conforme seu projeto

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.all('/notes/:id', (req, res) => handleRequest(req, res, '/notes/'));
app.all('/codes/:id', (req, res) => handleRequest(req, res, '/codes/'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor local rodando em http://localhost:${PORT}`);
  console.log(`MongoDB local disponível em mongodb://root:example@localhost:27017`);
  console.log(`Endpoints disponíveis:`);
  console.log(`  GET/PUT http://localhost:${PORT}/notes/{id}`);
  console.log(`  GET/PUT http://localhost:${PORT}/codes/{id}`);
}); 