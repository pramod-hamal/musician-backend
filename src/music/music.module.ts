import { Module } from '@nestjs/common';
import { MusicController } from './music.controller';
import { MusicFactoryService } from './music.factory.service';
import { MusicRepository } from './music.repository';
import { MusicService } from './music.service';

@Module({
  controllers: [MusicController],
  providers: [MusicService, MusicRepository, MusicFactoryService],
})
export class MusicModule {}
