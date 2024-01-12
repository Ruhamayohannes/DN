import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { NotesController } from '../src/notes/notes.controller';
import { NoteService } from '../src/notes/notes.service';
import { NoteRepository } from '../src/notes/notes.repository';
import { User } from '../src/users/entities/user.entity';

describe('NotesController (e2e)', () => {
  let app: INestApplication;
  let noteService: NoteService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [NotesController],
      providers: [
        NoteService,
        {
          provide: NoteRepository,
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOneById: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    noteService = moduleFixture.get<NoteService>(NoteService);
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('POST /notes', () => {
    it('should create a new note', async () => {
      const noteData = { title: 'Test Note', content: 'Test Content' };
      const response = await request(app.getHttpServer())
        .post('/notes')
        .send(noteData);
      expect(response.status).toBe(HttpStatus.CREATED);
      // Additional assertions...
    });

    // More tests for different scenarios and error cases
  });

  describe('GET /notes', () => {
    it('should return an array of notes', async () => {
      const response = await request(app.getHttpServer()).get('/notes');
      expect(response.status).toBe(HttpStatus.OK);
      // Additional assertions...
    });

    // More tests for different scenarios and error cases
  });

  describe('GET /notes/:id', () => {
    it('should return a note by ID', async () => {
      const noteId = 1;
      const response = await request(app.getHttpServer()).get(
        `/notes/${noteId}`,
      );
      expect(response.status).toBe(HttpStatus.OK);
      // Additional assertions...
    });

    // Tests for not found, forbidden, etc.
  });

  describe('PATCH /notes/:id', () => {
    it('should update a note', async () => {
      const noteId = 1;
      const updateData = { title: 'Updated Title', content: 'Updated Content' };
      const response = await request(app.getHttpServer())
        .patch(`/notes/${noteId}`)
        .send(updateData);
      expect(response.status).toBe(HttpStatus.OK);
      // Additional assertions...
    });

    // Tests for not found, forbidden, invalid input, etc.
  });

  describe('DELETE /notes/:id', () => {
    it('should remove a note', async () => {
      const noteId = 1;
      const response = await request(app.getHttpServer()).delete(
        `/notes/${noteId}`,
      );
      expect(response.status).toBe(HttpStatus.OK);
      // Additional assertions...
    });

    // Tests for not found, forbidden, etc.
  });

  afterAll(async () => {
    await app.close();
  });
});
