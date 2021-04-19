import { MigrationInterface, QueryRunner, Table } from 'typeorm'

const table_name = 'ops_users'

export class OpsUserMigration1609251179702 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: table_name,
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'email',
            type: 'varchar',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'first_name',
            type: 'varchar',
          },
          {
            name: 'last_name',
            type: 'varchar',
          },
          {
            name: 'avatar_url',
            type: 'longtext',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            isGenerated: true,
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'login_provider',
            type: 'varchar',
          },
          {
            name: 'temp_secret_2fa',
            type: 'longtext',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            isGenerated: true,
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'enabled_2fa',
            type: 'tinyint',
          },
        ],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(table_name)
  }
}
