import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import * as path from 'path';
import AppException from 'src/common/error/app.exception';
import { Worker } from 'worker_threads';
import { UsersService } from '../users.service';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { format } from 'fast-csv';
import { UsersRepository } from '../user.repository';

@Injectable()
export class ArtistCsvService {
  constructor(
    @InjectQueue('artist-csv') private readonly csvImportQueue: Queue,
    private readonly userService: UsersService,
    private readonly usersRepository: UsersRepository,
  ) {}

  async importCsv(buffer: Buffer): Promise<void> {
    return new Promise((resolve, reject) => {
      const worker = new Worker(
        path.join(__dirname, '../../common/worker/import.artist.js'),
      );

      worker.on('message', (message) => {
        if (message.data) {
          this.csvImportQueue.add('import-csv', message.data, {
            delay: 2000,
          });
        } else if (message.success) {
          resolve();
        } else if (!message.success) {
          reject(new AppException(message.error));
        }
      });

      worker.on('error', (error) => reject(`Worker error: ${error.message}`));
      worker.on('exit', (code) => {
        if (code !== 0) {
          reject('Worker stopped with exit code ' + code);
        }
      });

      worker.postMessage({ fileBuffer: buffer });
    });
  }

  async exportCsv(): Promise<string> {
    const artistsStream = await this.usersRepository.findAllAsStream();
    return new Promise((resolve, reject) => {
      const filePath = path.join(__dirname, '/downloadable/artist.csv');
      if (!existsSync(path.join(__dirname, '/downloadable'))) {
        mkdirSync(path.join(__dirname, '/downloadable'));
      }

      const writeStream = createWriteStream(filePath);
      const csvStream = format({
        headers: [
          'id',
          'first_name',
          'last_name',
          'email',
          'phone',
          'dob',
          'created_at',
        ],
      });
      csvStream.pipe(writeStream);
      artistsStream
        .on('data', (artist) => {
          csvStream.write([
            artist.id,
            artist.first_name,
            artist.last_name,
            artist.email,
            artist.phone,
            artist.dob,
            artist.created_at,
          ]);
        })
        .on('end', () => {
          csvStream.end();
          console.log('CSV file created successfully');
          resolve(filePath);
        })
        .on('error', (error) => {
          console.error('Error fetching artists:', error);
          reject(new AppException(error.message));
        });
    });
  }
}
