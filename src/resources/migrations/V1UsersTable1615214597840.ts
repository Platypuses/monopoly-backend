import { MigrationInterface, QueryRunner } from 'typeorm';
import MigrationRunner from './MigrationRunner';

/* eslint-disable */

export default class V1UsersTable1615214597840
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await MigrationRunner.runMigration(
      'V1_Create_users_table.sql',
      queryRunner,
    );
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
  }
}
