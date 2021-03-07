import { MigrationInterface, QueryRunner, Table } from 'typeorm';

/* eslint-disable */

export default class CreateUsersTable1615108604961 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isNullable: false,
            isPrimary: true
          },
          {
            name: 'email',
            type: 'text',
            isNullable: false
          },
          {
            name: 'name',
            type: 'text',
            isNullable: false
          }
        ]
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users')
  }
}
