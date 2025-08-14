import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { handleRequest } from '../src/handler.js';

// Create test server with rate limiting (same setup as main server)
const createTestServer = () => {
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

  // Rate limiting middleware (same as production)
  const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 30, // Limit each IP to 30 requests per minute
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

  return app;
};

describe('Rate Limiting', () => {
  let mongoServer: MongoMemoryServer;
  let app: express.Application;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    process.env.MONGO_URI = mongoUri;
    process.env.MONGO_DB = 'test_quikpad_ratelimit';
    process.env.NOTES_COLLECTION = 'test_quikNotes_ratelimit';
    process.env.CODES_COLLECTION = 'test_quikCodes_ratelimit';
    
    app = createTestServer();
  }, 30000);

  afterAll(async () => {
    if (mongoServer) {
      await mongoServer.stop();
    }
  }, 30000);

  describe('API Routes Rate Limiting', () => {
    it('should allow requests within the limit', async () => {
      // Make several requests within the limit (30 per minute)
      for (let i = 0; i < 5; i++) {
        const response = await request(app)
          .get('/notes/test123')
          .expect(404); // 404 is expected since note doesn't exist
        
        expect(response.headers['ratelimit-limit']).toBe('30');
        expect(response.headers['ratelimit-remaining']).toBe(String(30 - i - 1));
      }
    });

    it('should block requests when limit is exceeded', async () => {
      // Create a new app instance to avoid interference with previous test
      const testApp = createTestServer();
      
      // Make requests up to the limit
      for (let i = 0; i < 30; i++) {
        await request(testApp)
          .get('/notes/test' + i)
          .expect(404);
      }

      // 31st request should be rate limited
      const response = await request(testApp)
        .get('/notes/test31')
        .expect(429);
      
      expect(response.body.error).toBe('Too many requests from this IP, please try again later.');
      expect(response.body.retryAfter).toBe('1 minute');
    });

    it('should rate limit PUT requests as well', async () => {
      const testApp = createTestServer();
      
      // Make PUT requests up to the limit
      for (let i = 0; i < 30; i++) {
        await request(testApp)
          .put('/notes/test' + i)
          .send({ content: `Test content ${i}` })
          .expect(200);
      }

      // 31st PUT request should be rate limited
      const response = await request(testApp)
        .put('/notes/test31')
        .send({ content: 'This should be blocked' })
        .expect(429);
      
      expect(response.body.error).toBe('Too many requests from this IP, please try again later.');
    });

    it('should rate limit codes routes', async () => {
      const testApp = createTestServer();
      
      // Make requests up to the limit
      for (let i = 0; i < 30; i++) {
        await request(testApp)
          .put('/codes/test' + i)
          .send({ content: `console.log(${i});`, language: 'javascript' })
          .expect(200);
      }

      // 31st request should be rate limited
      const response = await request(testApp)
        .get('/codes/test31')
        .expect(429);
      
      expect(response.body.error).toBe('Too many requests from this IP, please try again later.');
    });
  });

  describe('Health Endpoint Rate Limiting', () => {
    it('should allow health checks within the limit', async () => {
      const testApp = createTestServer();
      
      // Make several health checks within the limit (10 per minute)
      for (let i = 0; i < 5; i++) {
        const response = await request(testApp)
          .get('/health')
          .expect(200);
        
        expect(response.text).toBe('OK');
        expect(response.headers['ratelimit-limit']).toBe('10');
        expect(response.headers['ratelimit-remaining']).toBe(String(10 - i - 1));
      }
    });

    it('should block health checks when limit is exceeded', async () => {
      const testApp = createTestServer();
      
      // Make health checks up to the limit
      for (let i = 0; i < 10; i++) {
        await request(testApp)
          .get('/health')
          .expect(200);
      }

      // 11th health check should be rate limited
      const response = await request(testApp)
        .get('/health')
        .expect(429);
      
      expect(response.body.error).toBe('Too many health check requests, please try again later.');
    });
  });

  describe('Rate Limit Headers', () => {
    it('should include proper rate limit headers', async () => {
      const testApp = createTestServer();
      
      const response = await request(testApp)
        .get('/notes/headertest')
        .expect(404);
      
      expect(response.headers['ratelimit-limit']).toBe('30');
      expect(response.headers['ratelimit-remaining']).toBe('29');
      expect(response.headers['ratelimit-reset']).toBeDefined();
      
      // Should not have legacy headers
      expect(response.headers['x-ratelimit-limit']).toBeUndefined();
      expect(response.headers['x-ratelimit-remaining']).toBeUndefined();
    });
  });
});