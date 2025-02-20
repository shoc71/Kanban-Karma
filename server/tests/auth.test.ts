import request from 'supertest';
import app from '../src/index';
import server from '../src/index';

describe('Auth API Tests', () => {
  let token: string;

  it('should register a new user', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
    token = res.body.data;
  });

  it('should login the user', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'password123',
    });

    console.log('Full login response:', res.body);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
    token = res.body.data;
  });

  it('should reject an invalid login', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'wrong@example.com',
      password: 'wrongpassword',
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });
});

afterAll(async () => {
  server.close(); // Close the server after tests run
});