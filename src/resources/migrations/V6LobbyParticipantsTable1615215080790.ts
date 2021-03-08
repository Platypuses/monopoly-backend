import { MigrationInterface, QueryRunner } from 'typeorm';
import MigrationRunner from './utils/MigrationRunner';

/* eslint-disable */

export default class V6LobbyParticipantsTable1615215080790
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await MigrationRunner.runMigration(
      'V6_Create_lobby_participants_table.sql',
      queryRunner,
    );
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
  }
}
