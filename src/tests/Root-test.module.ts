import { Module } from '@nestjs/common';
import { NoteModule } from '../notes/notes.module';
import { NoteService } from '../notes/notes.service';
import { NoteRepository } from '../notes/notes.repository';
import { UserModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { UserRepository } from '../users/users.repository';
import { AppModule } from '../app.module';
import { AppService } from '../app.service';

@Module({
  imports: [NoteModule, UserModule, AppModule],
  providers: [
    NoteService,
    NoteRepository,
    UsersService,
    UserRepository,
    AppService,
  ],
})
export class RootTestModule {}
