import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ArtistCsvQueueProcessorService } from './artist-csv-queue.processor.service';
import { ArtistCsvService } from './artist-csv.service';

@Module({
  imports: [
    BullModule.registerQueueAsync({
      name: 'artist-csv',
      useFactory: () => {
        return {
          redis: {
            host: 'localhost',
            port: 6379,
          },
        };
      },
    }),
  ],
  providers: [ArtistCsvService, ArtistCsvQueueProcessorService],
  exports: [ArtistCsvService, ArtistCsvQueueProcessorService],
})
export class ArtistCsvModule {}
