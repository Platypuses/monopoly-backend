import { MigrationInterface, QueryRunner } from 'typeorm';
import MigrationRunner from './MigrationRunner';

/* eslint-disable */

export default class V7LobbyMessagesTable1615215122198
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await MigrationRunner.runMigration(
      'V7_Create_lobby_messages_table.sql',
      queryRunner,
    );
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
  }
}
