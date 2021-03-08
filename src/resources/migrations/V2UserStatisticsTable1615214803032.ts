import { MigrationInterface, QueryRunner } from 'typeorm';
import MigrationRunner from './MigrationRunner';

/* eslint-disable */

export default class V2UserStatisticsTable1615214803032
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await MigrationRunner.runMigration(
      'V2_Create_user_statistics_table.sql',
      queryRunner,
    );
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
  }
}
