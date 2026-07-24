import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_process_steps_block_cta_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_process_steps_block_cta_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_process_steps_block_cta_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_process_steps_block_cta_link_appearance" AS ENUM('default', 'outline');
  CREATE TABLE "pages_blocks_process_steps_block_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_process_steps_block_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_pages_blocks_process_steps_block_cta_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_pages_blocks_process_steps_block_cta_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "pages_blocks_process_steps_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"image_id" integer,
  	"footer_badge" varchar,
  	"footer_text" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_process_steps_block_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_process_steps_block_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__pages_v_blocks_process_steps_block_cta_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum__pages_v_blocks_process_steps_block_cta_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_process_steps_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"image_id" integer,
  	"footer_badge" varchar,
  	"footer_text" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_process_steps_block_steps" ADD CONSTRAINT "pages_blocks_process_steps_block_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_process_steps_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_process_steps_block_cta" ADD CONSTRAINT "pages_blocks_process_steps_block_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_process_steps_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_process_steps_block" ADD CONSTRAINT "pages_blocks_process_steps_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_process_steps_block" ADD CONSTRAINT "pages_blocks_process_steps_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_process_steps_block_steps" ADD CONSTRAINT "_pages_v_blocks_process_steps_block_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_process_steps_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_process_steps_block_cta" ADD CONSTRAINT "_pages_v_blocks_process_steps_block_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_process_steps_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_process_steps_block" ADD CONSTRAINT "_pages_v_blocks_process_steps_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_process_steps_block" ADD CONSTRAINT "_pages_v_blocks_process_steps_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_process_steps_block_steps_order_idx" ON "pages_blocks_process_steps_block_steps" USING btree ("_order");
  CREATE INDEX "pages_blocks_process_steps_block_steps_parent_id_idx" ON "pages_blocks_process_steps_block_steps" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_process_steps_block_cta_order_idx" ON "pages_blocks_process_steps_block_cta" USING btree ("_order");
  CREATE INDEX "pages_blocks_process_steps_block_cta_parent_id_idx" ON "pages_blocks_process_steps_block_cta" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_process_steps_block_order_idx" ON "pages_blocks_process_steps_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_process_steps_block_parent_id_idx" ON "pages_blocks_process_steps_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_process_steps_block_path_idx" ON "pages_blocks_process_steps_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_process_steps_block_image_idx" ON "pages_blocks_process_steps_block" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_process_steps_block_steps_order_idx" ON "_pages_v_blocks_process_steps_block_steps" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_process_steps_block_steps_parent_id_idx" ON "_pages_v_blocks_process_steps_block_steps" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_process_steps_block_cta_order_idx" ON "_pages_v_blocks_process_steps_block_cta" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_process_steps_block_cta_parent_id_idx" ON "_pages_v_blocks_process_steps_block_cta" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_process_steps_block_order_idx" ON "_pages_v_blocks_process_steps_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_process_steps_block_parent_id_idx" ON "_pages_v_blocks_process_steps_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_process_steps_block_path_idx" ON "_pages_v_blocks_process_steps_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_process_steps_block_image_idx" ON "_pages_v_blocks_process_steps_block" USING btree ("image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_process_steps_block_steps" CASCADE;
  DROP TABLE "pages_blocks_process_steps_block_cta" CASCADE;
  DROP TABLE "pages_blocks_process_steps_block" CASCADE;
  DROP TABLE "_pages_v_blocks_process_steps_block_steps" CASCADE;
  DROP TABLE "_pages_v_blocks_process_steps_block_cta" CASCADE;
  DROP TABLE "_pages_v_blocks_process_steps_block" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_process_steps_block_cta_link_type";
  DROP TYPE "public"."enum_pages_blocks_process_steps_block_cta_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_process_steps_block_cta_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_process_steps_block_cta_link_appearance";`)
}
