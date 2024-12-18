import { Injectable, Logger } from '@nestjs/common';
import { Connection } from 'mysql2/promise';
import * as bcrypt from 'bcrypt';
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
                role ENUM('super_admin', 'artist_manager', 'artist') DEFAULT 'artist',
                address VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP);`;
        await this.connection.query(createTableQuery);

        this.logger.log('Users table created successfully');
      } else {
        this.logger.log('Users table already exists');
      }
      const password = await bcrypt.hash('password', 12);
      await this.connection.query('INSERT IGNORE INTO users SET ?', {
        first_name: 'Pramod',
        last_name: 'Hamal',
        email: 'superadmin@gmail.com',
        password: password,
        role: 'super_admin',
      });
    } catch (error) {
      this.logger.error('Error seeding users table', error.stack);
    }
  }

  async seedMusic() {
    const tableCheckQuery = `
    SELECT COUNT(*)
    FROM information_schema.tables
    WHERE table_schema = 'musicians' AND table_name = 'music';
  `;
    try {
      const [result] = await this.connection.query(tableCheckQuery);

      const tableExists = result[0]['COUNT(*)'] > 0;

      if (!tableExists) {
        const createTableQuery = `
        CREATE TABLE music (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          title VARCHAR(255) NOT NULL,
          album_name VARCHAR(255),
          genre ENUM('RnB', 'Country', 'Classic', 'Jazz', 'Rock') NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
      `;
        await this.connection.query(createTableQuery);
        this.logger.log('Music table created successfully');
      }
    } catch (err) {
      this.logger.error('Error seeding music table', err.stack);
    }
  }

  async seed() {
    await this.seedUsers();
    await this.seedMusic();
  }
}
