import { Injectable, Logger } from '@nestjs/common';
import { Connection as StreamConnection } from 'mysql2';
import { Connection, ResultSetHeader, Pool } from 'mysql2/promise';
import { Stream } from 'stream';
import { DatabaseService } from '../database/database.service';
import { IPaginationData } from '../response/pagination-data.interface';
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

  async findAllAsStream(
    conditions = {},
    sort = {
      created_at: 'DESC',
    },
  ): Promise<Stream> {
    const pool = this.databaseService.getConnection() as unknown as Pool;
    const whereConditions = this.buildWhereClause(conditions);
    const orderByClause = this.buildOrderByClause(sort);
    const query = `SELECT * FROM ?? ${whereConditions.sql} ${orderByClause}`;
    const conn = await pool.getConnection();
    const streamConnection = (conn as any).connection as StreamConnection;
    try {
      return streamConnection
        .query(query, [this.tableName, ...whereConditions.values])
        .stream({
          objectMode: true,
        });
    } catch (error) {
      this.logger.error(
        `Error retrieving data from ${this.tableName}`,
        error.stack,
      );
      throw error;
    }
  }

  async findAllWithoutPagination(
    conditions = {},
    sort = {
      created_at: 'DESC',
    },
  ) {
    this.connection = this.databaseService.getConnection();
    const whereConditions = this.buildWhereClause(conditions);
    const orderByClause = this.buildOrderByClause(sort);
    const query = `SELECT * FROM ?? ${whereConditions.sql} ${orderByClause}`;
    try {
      const [results] = await this.connection.query(query, [
        this.tableName,
        ...whereConditions.values,
      ]);
      return results as T[];
    } catch (error) {
      this.logger.error(
        `Error retrieving data from ${this.tableName}`,
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
  ): Promise<IPaginationData> {
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
        data: results as T[],
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

  async create(data: T) {
    this.connection = this.databaseService.getConnection();
    const query = `INSERT INTO ?? SET ?`;
    try {
      const [result] = await this.connection.query<ResultSetHeader>(query, [
        this.tableName,
        data,
      ]);
      return result;
    } catch (error) {
      this.logger.error(
        `Error creating data in ${this.tableName}`,
        error.stack,
      );
      throw error;
    }
  }

  async update(conditions: object, data: T) {
    this.connection = this.databaseService.getConnection();
    const whereConditions = this.buildWhereClause(conditions);
    const query = `UPDATE ?? SET ? ${whereConditions.sql}`;
    try {
      const [result] = await this.connection.query(query, [
        this.tableName,
        data,
        ...whereConditions.values,
      ]);
      return result;
    } catch (error) {
      this.logger.error(
        `Error updating data in ${this.tableName}`,
        error.stack,
      );
      throw error;
    }
  }

  async remove(conditions: object) {
    this.connection = this.databaseService.getConnection();
    const whereConditions = this.buildWhereClause(conditions);
    const query = `DELETE FROM ?? ${whereConditions.sql}`;
    try {
      return this.connection.query(query, [
        this.tableName,
        ...whereConditions.values,
      ]);
    } catch (error) {
      this.logger.error(
        `Error deleting data from ${this.tableName}`,
        error.stack,
      );
      throw error;
    }
  }

  async rawQuery(query: string) {
    this.connection = this.databaseService.getConnection();
    try {
      return await this.connection.query(query);
    } catch (error) {
      this.logger.error('Error executing custom query', error.stack);
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
