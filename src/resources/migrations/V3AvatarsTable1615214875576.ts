import { MigrationInterface, QueryRunner } from 'typeorm';
import MigrationRunner from './MigrationRunner';

/* eslint-disable */

export default class V3AvatarsTable1615214875576
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await MigrationRunner.runMigration(
      'V3_Create_avatars_table.sql',
      queryRunner,
    );
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
  }
}
