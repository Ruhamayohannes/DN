import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppController } from '../src/app.controller';
import { AppService } from '../src/app.service';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../src/users/users.repository';
import { User } from '../src/users/entities/user.entity';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let appService: AppService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, JwtService, UserRepository],
    }).compile();

    appService = moduleFixture.get<AppService>(AppService);
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/api/register (POST)', () => {
    it('should register a user', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'user',
      };
      const response = await request(app.getHttpServer())
        .post('/api/register')
        .send(userData);

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body).toHaveProperty('id');
    });
  });

  describe('/api/login (POST)', () => {
    it('should log in a user', async () => {
      const loginData = { email: 'john@example.com', password: 'password123' };
      const response = await request(app.getHttpServer())
        .post('/api/login')
        .send(loginData);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toHaveProperty('message', 'Logged in successfully');
    });
  });

  describe('/api/user (GET)', () => {
    it('should retrieve user information', async () => {
      const loginResponse = await request(app.getHttpServer())
        .post('/api/login')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(loginResponse.status).toBe(HttpStatus.OK);
      const token = loginResponse.body.token;

      const userResponse = await request(app.getHttpServer())
        .get('/api/user')
        .set('Authorization', `Bearer ${token}`);

      expect(userResponse.status).toBe(HttpStatus.OK);
      expect(userResponse.body).toHaveProperty('id');
    });
  });

  describe('/api/logout (POST)', () => {
    it('should logout the user', async () => {
      const loginResponse = await request(app.getHttpServer())
        .post('/api/login')
        .send({ email: 'test@example.com', password: 'password123' });

      const token = loginResponse.body.token; // Adjust based on your app's response

      const logoutResponse = await request(app.getHttpServer())
        .post('/api/logout')
        .set('Authorization', `Bearer ${token}`);

      expect(logoutResponse.status).toBe(HttpStatus.OK);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
