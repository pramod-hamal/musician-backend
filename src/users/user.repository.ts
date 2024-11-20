import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/common/database/database.service';
import { GenericRepository } from 'src/common/repository/generic.repository';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersRepository extends GenericRepository<UserEntity> {
  constructor(private readonly dbService: DatabaseService) {
    super(dbService, 'users');
  }
}
