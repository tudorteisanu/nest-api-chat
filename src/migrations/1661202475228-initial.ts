import { MigrationInterface, QueryRunner } from 'typeorm';

export class initial1661202475228 implements MigrationInterface {
  name = 'initial1661202475228';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "room" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c6d46db005d623e691b2fbcba23" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "file" ("id" SERIAL NOT NULL, "originalname" character varying NOT NULL, "encoding" character varying NOT NULL, "mimetype" character varying NOT NULL, "destination" character varying NOT NULL, "filename" character varying NOT NULL, "path" character varying NOT NULL, "size" numeric NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "message" ("id" SERIAL NOT NULL, "message" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "roomId" integer, "authorId" integer, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "room_users_user" ("roomId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_e811974018202e969e902e794de" PRIMARY KEY ("roomId", "userId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_764292bbbb93544a050f844c49" ON "room_users_user" ("roomId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6c675caa22685ba1e0ebeb0f65" ON "room_users_user" ("userId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "message_attachments_file" ("messageId" integer NOT NULL, "fileId" integer NOT NULL, CONSTRAINT "PK_9a5cf3935aedebe09f88e8a244a" PRIMARY KEY ("messageId", "fileId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5cba640fecfebc3d2e4496983f" ON "message_attachments_file" ("messageId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b96f97c61a092fe4479aa150a0" ON "message_attachments_file" ("fileId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "message" ADD CONSTRAINT "FK_fdfe54a21d1542c564384b74d5c" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "message" ADD CONSTRAINT "FK_c72d82fa0e8699a141ed6cc41b3" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_users_user" ADD CONSTRAINT "FK_764292bbbb93544a050f844c499" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_users_user" ADD CONSTRAINT "FK_6c675caa22685ba1e0ebeb0f654" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "message_attachments_file" ADD CONSTRAINT "FK_5cba640fecfebc3d2e4496983fe" FOREIGN KEY ("messageId") REFERENCES "message"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "message_attachments_file" ADD CONSTRAINT "FK_b96f97c61a092fe4479aa150a02" FOREIGN KEY ("fileId") REFERENCES "file"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "message_attachments_file" DROP CONSTRAINT "FK_b96f97c61a092fe4479aa150a02"`,
    );
    await queryRunner.query(
      `ALTER TABLE "message_attachments_file" DROP CONSTRAINT "FK_5cba640fecfebc3d2e4496983fe"`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_users_user" DROP CONSTRAINT "FK_6c675caa22685ba1e0ebeb0f654"`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_users_user" DROP CONSTRAINT "FK_764292bbbb93544a050f844c499"`,
    );
    await queryRunner.query(
      `ALTER TABLE "message" DROP CONSTRAINT "FK_c72d82fa0e8699a141ed6cc41b3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "message" DROP CONSTRAINT "FK_fdfe54a21d1542c564384b74d5c"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b96f97c61a092fe4479aa150a0"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5cba640fecfebc3d2e4496983f"`,
    );
    await queryRunner.query(`DROP TABLE "message_attachments_file"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6c675caa22685ba1e0ebeb0f65"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_764292bbbb93544a050f844c49"`,
    );
    await queryRunner.query(`DROP TABLE "room_users_user"`);
    await queryRunner.query(`DROP TABLE "message"`);
    await queryRunner.query(`DROP TABLE "file"`);
    await queryRunner.query(`DROP TABLE "room"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
