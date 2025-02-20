import request from 'supertest';
import app from '../src/index';

describe('Task Routes Tests', () => {
  let token: string;

  beforeAll(async () => {
    const loginRes = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'password123',
    });
    token = loginRes.body.data;
  });

  it('should fetch tasks for authenticated user', async () => {
    console.log('Using Token:', token);
    const res = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    // expect(res.body.success).toBe(true);
    // expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should reject requests without a token', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.statusCode).toBe(401);
  });
});
