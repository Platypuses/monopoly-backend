import { QueryRunner } from 'typeorm';
import fs from 'fs';

export default {
  async runMigration(
    scriptName: string,
    queryRunner: QueryRunner
  ): Promise<void> {
    const query = await fs.promises.readFile(
      `src/resources/migrations/sql/${scriptName}`,
      { encoding: 'utf-8' }
    );
    await queryRunner.query(query);
  },
};
