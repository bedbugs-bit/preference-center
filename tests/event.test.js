import request from 'supertest';
import app from '../server.js';

describe('Event API', () => {
  it('should create a new event for a user', async () => {
    const userRes = await request(app)
      .post('/api/users')
      .send({ email: 'user@example.com' });

    const userId = userRes.body.id;

    const eventRes = await request(app)
      .post('/api/events')
      .send({
        userId,
        consentId: 'email_notifications',
        enabled: true
      });

    expect(eventRes.statusCode).toBe(201);
    expect(eventRes.body).toHaveProperty('id');
    expect(eventRes.body.consent_id).toBe('email_notifications');
  });
});
