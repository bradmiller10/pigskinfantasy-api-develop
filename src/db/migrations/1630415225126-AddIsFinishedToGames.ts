import {MigrationInterface, QueryRunner} from "typeorm";

export class AddIsFinishedToGames1630415225126 implements MigrationInterface {
    name = 'AddIsFinishedToGames1630415225126'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "games" ADD "isFinished" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ALTER COLUMN "expiresAt" SET DEFAULT '"2021-08-31T13:07:08.500+00:00"'`);
        await queryRunner.query(`ALTER TABLE "auth_attempts" DROP COLUMN "type"`);
        await queryRunner.query(`ALTER TABLE "auth_attempts" ADD "type" "auth_attempts_type_enum" NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auth_attempts" DROP COLUMN "type"`);
        await queryRunner.query(`ALTER TABLE "auth_attempts" ADD "type" auth_attempts_type_enum NOT NULL`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ALTER COLUMN "expiresAt" SET DEFAULT '2021-08-10 19:26:55.721'`);
        await queryRunner.query(`ALTER TABLE "games" DROP COLUMN "isFinished"`);
    }

}
