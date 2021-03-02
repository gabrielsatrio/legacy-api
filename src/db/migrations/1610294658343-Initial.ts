import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1610294658343 implements MigrationInterface {
  name = 'Initial1610294658343';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "updoot" ("user_id" uuid NOT NULL, "post_id" integer NOT NULL, "value" integer NOT NULL, "pos_id" integer, CONSTRAINT "PK_75a94fd37f3ac19f30dddadc816" PRIMARY KEY ("user_id", "post_id"))`
    );
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.query(
      `CREATE TYPE "user_role_enum" AS ENUM('VIEWER', 'EDITOR', 'ADMIN')`
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying, "password" character varying NOT NULL, "email" character varying NOT NULL, "role" "user_role_enum" NOT NULL DEFAULT 'VIEWER', "confirmed" boolean NOT NULL DEFAULT false, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3cf126e6a296167f4d4d782a84" ON "user" ("is_active") `
    );
    await queryRunner.query(
      `CREATE TABLE "post" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "text" character varying NOT NULL, "points" integer NOT NULL DEFAULT 0, "creator_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "updoot" ADD CONSTRAINT "FK_41eea10f074305d0f0d36bcd49e" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "updoot" ADD CONSTRAINT "FK_4211d3dcab85820ecc9f4498d47" FOREIGN KEY ("pos_id") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "post" ADD CONSTRAINT "FK_cdb7a69f6107ba4227908d6ed55" FOREIGN KEY ("creator_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post" DROP CONSTRAINT "FK_cdb7a69f6107ba4227908d6ed55"`
    );
    await queryRunner.query(
      `ALTER TABLE "updoot" DROP CONSTRAINT "FK_4211d3dcab85820ecc9f4498d47"`
    );
    await queryRunner.query(
      `ALTER TABLE "updoot" DROP CONSTRAINT "FK_41eea10f074305d0f0d36bcd49e"`
    );
    await queryRunner.query(`DROP TABLE "post"`);
    await queryRunner.query(`DROP INDEX "IDX_3cf126e6a296167f4d4d782a84"`);
    await queryRunner.query(`DROP INDEX "IDX_e12875dfb3b1d92d7d7c5377e2"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TYPE "user_role_enum"`);
    await queryRunner.query(`DROP TABLE "updoot"`);
  }
}
