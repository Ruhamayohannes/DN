import {Injectable, NotFoundException, ForbiddenException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NoteRepository } from './notes.repository';
import { Note } from './entities/note.entity';
import { User } from '../users/entities/user.entity';
import { CreateNoteDto } from './dto/create-note.dto';

@Injectable()
export class NoteService {
  findOneOrFail(id: number) {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(NoteRepository)
    private readonly noteRepository: NoteRepository,
  ) {}

  async create(user: User, createNoteDto: CreateNoteDto): Promise<Note> {
    const { title, content } = createNoteDto;
    const note = this.noteRepository.create({ title, content, user });
    return this.noteRepository.save(note);
  }

  async findAll(user: User): Promise<Note[]> {
    return this.noteRepository.find({ where: { user } });
  }

  async findOne(user: User, noteId: number): Promise<Note> {
    const note = await this.findNoteById(noteId);

    this.checkUserPermission(user, note);

    return note;
  }

  async findOneByTitle(user: User, title: string): Promise<Note> {
    const note = await this.noteRepository.findOne({ where: { user, title } });

    if (!note) {
      throw new NotFoundException(`Note with title ${title} not found`);
    }

    return note;
  }

  async update(
    user: User,
    noteId: number,
    title: string,
    content: string,
  ): Promise<Note> {
    const note = await this.findNoteById(noteId);
    this.checkUserPermission(user, note);

    note.title = title;
    note.content = content;

    return this.noteRepository.save(note);
  }

  async remove(user: User, noteId: number): Promise<void> {
    const note = await this.findNoteById(noteId);

    this.checkUserPermission(user, note);

    await this.noteRepository.remove(note);
  }

  private async findNoteById(noteId: number): Promise<Note> {
    const note = await this.noteRepository.findOneById(noteId);

    if (!note) {
      throw new NotFoundException(`Note with ID ${noteId} not found`);
    }

    return note;
  }

  private checkUserPermission(user: User, note: Note): void {
    if (user.role === 'User' && note.user.id !== user.id) {
      throw new ForbiddenException(
        'You do not have permission to access or modify this note.',
      );
    }
  }
}
