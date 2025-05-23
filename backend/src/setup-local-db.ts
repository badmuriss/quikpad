import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { 
  CreateTableCommand, 
  AttributeDefinition,
  KeySchemaElement
} from "@aws-sdk/client-dynamodb";
import * as dotenv from 'dotenv';
dotenv.config();

const client = new DynamoDBClient({
  region: 'local',
  endpoint: 'http://localhost:8000',
  credentials: {
    accessKeyId: 'local',
    secretAccessKey: 'local'
  }
});

const NOTES_TABLE = process.env.NOTES_TABLE_NAME;
const CODES_TABLE = process.env.CODES_TABLE_NAME;

async function createTables() {
  try {
    const keySchema: KeySchemaElement[] = [
      { AttributeName: 'id', KeyType: 'HASH' }
    ];
    
    const attributeDefinitions: AttributeDefinition[] = [
      { AttributeName: 'id', AttributeType: 'S' }
    ];

    await client.send(new CreateTableCommand({
      TableName: NOTES_TABLE,
      KeySchema: keySchema,
      AttributeDefinitions: attributeDefinitions,
      ProvisionedThroughput: { 
        ReadCapacityUnits: 5, 
        WriteCapacityUnits: 5 
      },
    }));
    
    console.log(`Tabela ${NOTES_TABLE} criada com sucesso!`);
    
    await client.send(new CreateTableCommand({
      TableName: CODES_TABLE,
      KeySchema: keySchema,
      AttributeDefinitions: attributeDefinitions,
      ProvisionedThroughput: { 
        ReadCapacityUnits: 5, 
        WriteCapacityUnits: 5 
      }
    }));
    
    console.log(`Tabela ${CODES_TABLE} criada com sucesso!`);
    
  } catch (error) {
    console.error('Erro ao criar tabelas:', error);
  }
}

createTables();