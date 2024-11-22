import { Process, Processor } from '@nestjs/bull';
import { UsersService } from '../users.service';

@Processor('artist-csv')
export class ArtistCsvQueueProcessorService {
  constructor(private readonly userService: UsersService) {}

  @Process('import-csv')
  async importRow(job: any) {
    try {
      const user = await this.userService.create(job.data);
      console.log(user);
    } catch (err) {
      console.log(err.message);
    }
  }
}
