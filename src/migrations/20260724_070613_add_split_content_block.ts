import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_split_content_block_image_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_pages_blocks_split_content_block_background" AS ENUM('white', 'gray');
  CREATE TYPE "public"."enum_pages_blocks_split_content_block_padding" AS ENUM('small', 'medium', 'large');
  CREATE TYPE "public"."enum__pages_v_blocks_split_content_block_image_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum__pages_v_blocks_split_content_block_background" AS ENUM('white', 'gray');
  CREATE TYPE "public"."enum__pages_v_blocks_split_content_block_padding" AS ENUM('small', 'medium', 'large');
  CREATE TABLE "pages_blocks_split_content_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"image_position" "enum_pages_blocks_split_content_block_image_position" DEFAULT 'right',
  	"title" varchar,
  	"rich_text" jsonb,
  	"image_id" integer,
  	"rounded" boolean DEFAULT true,
  	"background" "enum_pages_blocks_split_content_block_background" DEFAULT 'white',
  	"padding" "enum_pages_blocks_split_content_block_padding" DEFAULT 'large',
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_split_content_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"image_position" "enum__pages_v_blocks_split_content_block_image_position" DEFAULT 'right',
  	"title" varchar,
  	"rich_text" jsonb,
  	"image_id" integer,
  	"rounded" boolean DEFAULT true,
  	"background" "enum__pages_v_blocks_split_content_block_background" DEFAULT 'white',
  	"padding" "enum__pages_v_blocks_split_content_block_padding" DEFAULT 'large',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_split_content_block" ADD CONSTRAINT "pages_blocks_split_content_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_split_content_block" ADD CONSTRAINT "pages_blocks_split_content_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_split_content_block" ADD CONSTRAINT "_pages_v_blocks_split_content_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_split_content_block" ADD CONSTRAINT "_pages_v_blocks_split_content_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_split_content_block_order_idx" ON "pages_blocks_split_content_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_split_content_block_parent_id_idx" ON "pages_blocks_split_content_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_split_content_block_path_idx" ON "pages_blocks_split_content_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_split_content_block_image_idx" ON "pages_blocks_split_content_block" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_split_content_block_order_idx" ON "_pages_v_blocks_split_content_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_split_content_block_parent_id_idx" ON "_pages_v_blocks_split_content_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_split_content_block_path_idx" ON "_pages_v_blocks_split_content_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_split_content_block_image_idx" ON "_pages_v_blocks_split_content_block" USING btree ("image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_split_content_block" CASCADE;
  DROP TABLE "_pages_v_blocks_split_content_block" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_split_content_block_image_position";
  DROP TYPE "public"."enum_pages_blocks_split_content_block_background";
  DROP TYPE "public"."enum_pages_blocks_split_content_block_padding";
  DROP TYPE "public"."enum__pages_v_blocks_split_content_block_image_position";
  DROP TYPE "public"."enum__pages_v_blocks_split_content_block_background";
  DROP TYPE "public"."enum__pages_v_blocks_split_content_block_padding";`)
}
