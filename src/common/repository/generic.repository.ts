import { Injectable, Logger } from '@nestjs/common';
import { Connection } from 'mysql2/promise';
import { DatabaseService } from '../database/database.service';

@Injectable()
export abstract class GenericRepository<T> {
  private logger = new Logger(GenericRepository.name);
  protected connection: Connection;
  private databaseService: DatabaseService;
  tableName: string;
  constructor(databaseService: DatabaseService, tableName: string) {
    this.databaseService = databaseService;
    this.tableName = tableName;
  }

  async getConnection() {
    try {
      this.connection = this.databaseService.getConnection();
      console.log('Database connection obtained from pool');
    } catch (error) {
      this.logger.error(
        'Failed to get database connection from pool',
        error.stack,
      );
      throw error;
    }
  }

  async findAll(
    conditions = {},
    page: number = 1,
    limit: number = 10,
    sort = {
      created_at: 'DESC',
    },
  ) {
    this.connection = this.databaseService.getConnection();
    const whereConditions = this.buildWhereClause(conditions);
    const countQuery = `SELECT COUNT(*) AS total FROM ??`;
    const [countResult]: any = await this.connection.query(countQuery, [
      this.tableName,
    ]);
    const total = countResult[0].total;

    const offset = (page - 1) * limit;

    const orderByClause = this.buildOrderByClause(sort);
    const query = `SELECT * FROM ?? ${whereConditions.sql} ${orderByClause} LIMIT ? OFFSET ?`;

    try {
      const [results] = await this.connection.query(query, [
        this.tableName,
        ...whereConditions.values,
        limit,
        offset,
      ]);
      return {
        data: results,
        total,
        limit: limit || 10,
        page: page || 1,
        previous: page > 1 ? `${Number(page) - 1}` : null,
        next: page * limit < total ? `${Number(page) + 1}` : null,
      };
    } catch (error) {
      this.logger.error(
        `Error retrieving data from ${this.tableName}`,
        error.stack,
      );
      throw error; // Re-throw the error if you need to handle it further up the chain
    }
  }

  async findOne(
    conditions = {},
    sort = {
      created_at: 'DESC',
    },
  ) {
    this.connection = this.databaseService.getConnection();
    const whereConditions = this.buildWhereClause(conditions);
    const orderByClause = this.buildOrderByClause(sort);
    const query = `SELECT * FROM ?? ${whereConditions.sql} ${orderByClause} LIMIT 1`;
    try {
      const [result] = await this.connection.query(query, [
        this.tableName,
        ...whereConditions.values,
      ]);
      return result[0];
    } catch (error) {
      this.logger.error(
        `Error retrieving data from ${this.tableName}`,
        error.stack,
      );
      throw error;
    }
  }

  private buildWhereClause(where: object) {
    let whereSql = '';
    let whereValues: any[] = [];

    if (Object.keys(where).length > 0) {
      whereSql = 'WHERE ';
      whereValues = Object.entries(where).map(([key, value], index) => {
        const isLast = index === Object.entries(where).length - 1;
        whereSql += `${key} = ?${isLast ? '' : ' AND '}`;
        return value;
      });
    }

    return {
      sql: whereSql,
      values: whereValues,
    };
  }

  private buildOrderByClause(sort: object) {
    let orderBySql = '';

    if (Object.keys(sort).length > 0) {
      orderBySql = 'ORDER BY ';
      const sortEntries = Object.entries(sort);
      orderBySql += sortEntries
        .map(([column, direction]) => {
          return `${column} ${direction.toUpperCase() === 'ASC' ? 'ASC' : 'DESC'}`;
        })
        .join(', ');
    }

    return orderBySql;
  }
}
