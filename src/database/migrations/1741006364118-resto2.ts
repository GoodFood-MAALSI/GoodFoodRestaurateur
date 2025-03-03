import { MigrationInterface, QueryRunner } from "typeorm";

export class Resto21741006364118 implements MigrationInterface {
    name = 'Resto21741006364118'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "restaurant"
            ADD "is_open" boolean NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "restaurant" DROP COLUMN "is_open"
        `);
    }

}
