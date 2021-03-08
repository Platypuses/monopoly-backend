import { MigrationInterface, QueryRunner } from 'typeorm';
import MigrationRunner from './MigrationRunner';

/* eslint-disable */

export default class V5LobbiesTable1615215024008
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await MigrationRunner.runMigration(
      'V5_Create_lobbies_table.sql',
      queryRunner,
    );
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
  }
}
