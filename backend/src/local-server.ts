import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { handler } from './handler';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { Request, Response } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import * as dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.all('/notes/:id', async (req, res) => {
  await handleRequest(req, res, '/notes/');
});

app.all('/codes/:id', async (req, res) => {
  await handleRequest(req, res, '/codes/');
});

async function handleRequest(req: Request<{ id: string; }, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>, number>, basePath: string) {
  try {
    const event: APIGatewayProxyEvent = {
      httpMethod: req.method,
      path: `${basePath}${req.params.id}`,
      pathParameters: {
        id: req.params.id
      },
      queryStringParameters: req.query as any,
      body: req.body ? JSON.stringify(req.body) : null,
      headers: req.headers as any,
      multiValueHeaders: {},
      isBase64Encoded: false,
      multiValueQueryStringParameters: null,
      stageVariables: null,
      requestContext: {} as any,
      resource: ''
    };
    
    const result = await handler(event);
    
    res.status(result.statusCode).set(result.headers || {}).send(
      result.body ? JSON.parse(result.body) : {}
    );
  } catch (error) {
    console.error('Erro ao processar requisição:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor local rodando em http://localhost:${PORT}`);
  console.log(`DynamoDB local disponível em http://localhost:8000`);
  console.log(`DynamoDB Admin UI disponível em http://localhost:8001`);
  console.log(`Endpoints disponíveis:`);
  console.log(`  GET/PUT http://localhost:${PORT}/notes/{id}`);
  console.log(`  GET/PUT http://localhost:${PORT}/codes/{id}`);
});