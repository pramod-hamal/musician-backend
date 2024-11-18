import { Injectable, Logger } from '@nestjs/common';
import { createConnection, Connection } from 'mysql2/promise';
import { SeederService } from 'src/seeder/seeder.service';

@Injectable()
export class DatabaseService {
  private connection: Connection;
  private readonly logger = new Logger(DatabaseService.name);

  constructor() {
    this.connect();
  }

  private async connect() {
    try {
      const initConnection = await createConnection({
        host: 'localhost',
        user: 'root',
        password: 'admin',
      });

      await initConnection.query('CREATE DATABASE IF NOT EXISTS musicians');
      this.connection = await createConnection({
        host: 'localhost',
        user: 'root',
        password: 'admin',
        database: 'musicians',
      });
      const seederService = new SeederService(this.connection);
      await seederService.seed();
      this.logger.log('Connected to MySQL database');
    } catch (error) {
      this.logger.error('Error connecting to MySQL database', error.stack);
    }
  }

  getConnection(): Connection {
    return this.connection;
  }
}
