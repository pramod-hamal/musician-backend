import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/common/database/database.service';
import { GenericRepository } from 'src/common/repository/generic.repository';
import { MusicEntity } from './entities/music.entity';

@Injectable()
export class MusicRepository extends GenericRepository<MusicEntity> {
  constructor(private readonly dbService: DatabaseService) {
    super(dbService, 'music');
  }
}
