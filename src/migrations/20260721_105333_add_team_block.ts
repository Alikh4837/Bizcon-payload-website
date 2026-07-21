import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_team_block_members_group" AS ENUM('partners', 'managers');
  CREATE TYPE "public"."enum__pages_v_blocks_team_block_members_group" AS ENUM('partners', 'managers');
  CREATE TABLE "pages_blocks_team_block_members" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"photo_id" integer,
  	"name" varchar,
  	"role" varchar,
  	"group" "enum_pages_blocks_team_block_members_group" DEFAULT 'partners',
  	"credentials" varchar,
  	"linkedin" varchar
  );
  
  CREATE TABLE "pages_blocks_team_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar DEFAULT 'Meet The Team',
  	"heading" varchar DEFAULT 'Our Proud Team',
  	"description" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_team_block_members" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"photo_id" integer,
  	"name" varchar,
  	"role" varchar,
  	"group" "enum__pages_v_blocks_team_block_members_group" DEFAULT 'partners',
  	"credentials" varchar,
  	"linkedin" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_team_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar DEFAULT 'Meet The Team',
  	"heading" varchar DEFAULT 'Our Proud Team',
  	"description" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_team_block_members" ADD CONSTRAINT "pages_blocks_team_block_members_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_team_block_members" ADD CONSTRAINT "pages_blocks_team_block_members_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_team_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_team_block" ADD CONSTRAINT "pages_blocks_team_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_team_block_members" ADD CONSTRAINT "_pages_v_blocks_team_block_members_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_team_block_members" ADD CONSTRAINT "_pages_v_blocks_team_block_members_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_team_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_team_block" ADD CONSTRAINT "_pages_v_blocks_team_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_team_block_members_order_idx" ON "pages_blocks_team_block_members" USING btree ("_order");
  CREATE INDEX "pages_blocks_team_block_members_parent_id_idx" ON "pages_blocks_team_block_members" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_team_block_members_photo_idx" ON "pages_blocks_team_block_members" USING btree ("photo_id");
  CREATE INDEX "pages_blocks_team_block_order_idx" ON "pages_blocks_team_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_team_block_parent_id_idx" ON "pages_blocks_team_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_team_block_path_idx" ON "pages_blocks_team_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_team_block_members_order_idx" ON "_pages_v_blocks_team_block_members" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_team_block_members_parent_id_idx" ON "_pages_v_blocks_team_block_members" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_team_block_members_photo_idx" ON "_pages_v_blocks_team_block_members" USING btree ("photo_id");
  CREATE INDEX "_pages_v_blocks_team_block_order_idx" ON "_pages_v_blocks_team_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_team_block_parent_id_idx" ON "_pages_v_blocks_team_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_team_block_path_idx" ON "_pages_v_blocks_team_block" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_team_block_members" CASCADE;
  DROP TABLE "pages_blocks_team_block" CASCADE;
  DROP TABLE "_pages_v_blocks_team_block_members" CASCADE;
  DROP TABLE "_pages_v_blocks_team_block" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_team_block_members_group";
  DROP TYPE "public"."enum__pages_v_blocks_team_block_members_group";`)
}
