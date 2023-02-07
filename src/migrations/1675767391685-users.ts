import { MigrationInterface, QueryRunner } from 'typeorm'

export class users1675767391685 implements MigrationInterface {
    name = 'users1675767391685'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "email" text NOT NULL,
                "nickname" text NOT NULL,
                "name" text NOT NULL,
                "password" text NOT NULL,
                "description" text,
                "avatar_id" text,
                "header_id" text,
                "refresh_token" text,
                CONSTRAINT "UQ_c3401836efedec3bec459c8f818" UNIQUE ("avatar_id"),
                CONSTRAINT "UQ_e0835e0637136d8d9dabeccf714" UNIQUE ("header_id"),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `)
        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email")
        `)
        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_ad02a1be8707004cb805a4b502" ON "users" ("nickname")
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX "public"."IDX_ad02a1be8707004cb805a4b502"
        `)
        await queryRunner.query(`
            DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"
        `)
        await queryRunner.query(`
            DROP TABLE "users"
        `)
    }
}
