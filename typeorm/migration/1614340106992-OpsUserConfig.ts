import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

const table_name = 'ops_users'
const table_column = 'config'

export class OpsUserConfig1614340106992 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      table_name,
      new TableColumn({
        name: table_column,
        type: 'json',
        isNullable: true,
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(table_name, table_column)
  }
}
