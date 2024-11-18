import { Injectable, Logger } from '@nestjs/common';
import { Connection } from 'mysql2/promise';

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);
  constructor(private readonly connection: Connection) {}
  async seedUsers() {
    const tableCheckQuery = `
      SELECT COUNT(*)
      FROM information_schema.tables
      WHERE table_schema = 'musicians' AND table_name = 'users';
    `;

    try {
      const [result] = await this.connection.query(tableCheckQuery);
      const tableExists = result[0]['COUNT(*)'] > 0;
      if (!tableExists) {
        const createTableQuery = `
                CREATE TABLE users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                first_name VARCHAR(255) NOT NULL,
                last_name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                phone VARCHAR(255),
                dob DATETIME,
                gender ENUM('male', 'female', 'others'),
                address VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP);`;
        await this.connection.query(createTableQuery);
        this.logger.log('Users table created successfully');
      } else {
        this.logger.log('Users table already exists');
      }
    } catch (error) {
      this.logger.log('Table already exists');
    }
  }

  async seed() {
    await this.seedUsers();
  }
}
