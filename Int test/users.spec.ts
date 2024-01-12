import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UsersController } from '../src/users/users.controller';
import { UsersService } from '../src/users/users.service';
import { UserRepository } from '../src/users/users.repository';
import { User } from '../src/users/entities/user.entity';
import { Role } from '../src/users/entities/role.enum';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let usersService: UsersService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: UserRepository,
          useValue: {
            createUser: jest
              .fn()
              .mockImplementation((dto) =>
                Promise.resolve({ ...dto, id: Date.now() }),
              ),
            findAll: jest.fn().mockResolvedValue([]),
            findOneByEmail: jest.fn(),
            findOneById: jest.fn(),
            updateUser: jest.fn(),
            removeUser: jest.fn(),
          },
        },
      ],
    }).compile();

    usersService = moduleFixture.get<UsersService>(UsersService);
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password',
        role: Role.User,
      };
      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send(userData);
      expect(response.status).toBe(HttpStatus.CREATED);
    });
  });

  describe('GET /api/users', () => {
    it('should return an array of users', async () => {
      const response = await request(app.getHttpServer()).get('/api/users');
      expect(response.status).toBe(HttpStatus.OK);
    });
  });
  describe('GET /api/users/:id', () => {
    it('should return a user by ID', async () => {
      const mockUser = new User();
      jest.spyOn(usersService, 'findOne').mockResolvedValue(mockUser);
      const response = await request(app.getHttpServer()).get('/api/users/1');
      expect(response.status).toBe(HttpStatus.OK);
    });

    it('should throw NotFoundException for a non-existent user', async () => {
      jest.spyOn(usersService, 'findOne').mockResolvedValue(null);
      const response = await request(app.getHttpServer()).get('/api/users/999');
      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe('PATCH /api/users/:id', () => {
    it('should update a user', async () => {
      const updateUserDto = { name: 'Updated Name' };
      const response = await request(app.getHttpServer())
        .patch('/api/users/1')
        .send(updateUserDto);
      expect(response.status).toBe(HttpStatus.OK);
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should remove a user', async () => {
      const response = await request(app.getHttpServer()).delete(
        '/api/users/1',
      );
      expect(response.status).toBe(HttpStatus.OK);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
