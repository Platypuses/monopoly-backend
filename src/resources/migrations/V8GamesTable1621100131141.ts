import { MigrationInterface, QueryRunner } from 'typeorm';
import MigrationRunner from './utils/MigrationRunner';

/* eslint-disable */

export default class V8GamesTable1621100131141
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await MigrationRunner.runMigration(
      'V8_Create_games_table.sql',
      queryRunner,
    );
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
  }
}
