import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as dotenv from 'dotenv';

// Carrega variáveis de ambiente sempre, mas só terá efeito no ambiente local
// Na AWS Lambda, as variáveis de ambiente são configuradas no ambiente
dotenv.config();

// Configuração do cliente DynamoDB
const isLocal = process.env.IS_LOCAL === 'true';
const clientConfig = isLocal 
  ? {
      region: 'local',
      endpoint: 'http://localhost:8000',
      credentials: {
        accessKeyId: 'local',
        secretAccessKey: 'local'
      }
    } 
  : { region: process.env.AWS_REGION || 'us-east-1' };

const client = new DynamoDBClient(clientConfig);
const docClient = DynamoDBDocumentClient.from(client);

const notesTableName = process.env.NOTES_TABLE_NAME;
const codesTableName = process.env.CODES_TABLE_NAME;

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    if (!notesTableName || !codesTableName) {
        console.error('Table names not configured properly');
        return { 
            statusCode: 500, 
            body: JSON.stringify({ message: 'Server configuration error' }) 
        };
    }

    const httpMethod = event.httpMethod;
    const path = event.path;
    const id = event.pathParameters?.id;

    let tableName: string;
    let isNoteRequest = false;

    if (path.startsWith('/notes/')) {
        tableName = notesTableName;
        isNoteRequest = true;
    } else if (path.startsWith('/codes/')) {
        tableName = codesTableName;
    } else {
        return { statusCode: 400, body: JSON.stringify({ message: 'Invalid request path' }) };
    }

    if (!id) {
        return { statusCode: 400, body: JSON.stringify({ message: 'Missing ID parameter' }) };
    }

    const now = Math.floor(Date.now() / 1000);
    const expiresAt = now + (30 * 24 * 60 * 60);

    try {
        if (httpMethod === 'GET') {
            const command = new GetCommand({ TableName: tableName, Key: { id: id } });
            const { Item } = await docClient.send(command);

            if (!Item) {
                return { statusCode: 404, body: JSON.stringify({ message: 'Not Found' }) };
            }
            const responseBody = { content: Item.content, updatedAt: Item.updatedAt };
            if (!isNoteRequest && Item.language) {
                (responseBody as any).language = Item.language;
            }
            return { 
                statusCode: 200, 
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(responseBody) 
            };

        } else if (httpMethod === 'PUT') {
            if (!event.body) {
                 return { statusCode: 400, body: JSON.stringify({ message: 'Request body is missing' }) };
            }
            
            let body;
            try {
                body = JSON.parse(event.body);
            } catch (e) {
                return { statusCode: 400, body: JSON.stringify({ message: 'Invalid JSON in request body' }) };
            }
            
            const content = body.content;
            const language = body.language;

            if (typeof content !== 'string') {
                 return { statusCode: 400, body: JSON.stringify({ message: 'Invalid content format' }) };
            }

            const itemToSave: any = {
                id: id,
                content: content,
                updatedAt: now,
                expiresAt: expiresAt,
            };
            if (!isNoteRequest && typeof language === 'string') {
                itemToSave.language = language;
            }

            const command = new PutCommand({ TableName: tableName, Item: itemToSave });
            await docClient.send(command);
            return { 
                statusCode: 200, 
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: 'Saved successfully', updatedAt: now }) 
            };
        } else {
            return { statusCode: 405, body: JSON.stringify({ message: 'Method Not Allowed' }) };
        }
    } catch (error) {
        console.error(`Error processing ${httpMethod} ${path} for table ${tableName}:`, error);
        return { statusCode: 500, body: JSON.stringify({ message: 'Internal Server Error' }) };
    }
};